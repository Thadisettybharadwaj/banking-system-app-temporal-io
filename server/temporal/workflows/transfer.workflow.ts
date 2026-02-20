import {
  proxyActivities,
  defineSignal,
  setHandler,
  condition,
  sleep,
  ApplicationFailure,
  defineQuery,
} from '@temporalio/workflow';
import type { TransferInput } from '../../interfaces/Interfaces';

//
// Activity Proxies
//
const { debitAccount, creditAccount, refundAccount, recordTransactionStatus } = proxyActivities({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3, // Retry credit up to 3 times
    initialInterval: '5 seconds',
  },
});

//
// Approval Signal
//
export const approveTransferSignal = defineSignal<[boolean]>('approveTransfer');

//
// Creating my own queyr
//
export const getTransferDetailsQuery = defineQuery('getTransferDetails');

//
// Workflow
//
export async function transferWorkflow(input: TransferInput) {
  const { transactionId, fromAccount, toAccount, amount } = input;

  let approved = false;
  let rejected = false;

  // Signal handler
  setHandler(approveTransferSignal, (decision: boolean) => {
    if (decision) {
      approved = true;
    } else {
      rejected = true;
    }
  });

  await recordTransactionStatus(transactionId, 'INITIATED');

  const THRESHOLD = 500;

  //
  // 🏦 Threshold Approval Logic
  //
  if (amount >= THRESHOLD) {
    await recordTransactionStatus(transactionId, 'AWAITING_APPROVAL');

    const storeTransferDetails = { transactionId, fromAccount, toAccount, amount };
    setHandler(getTransferDetailsQuery, () => storeTransferDetails);

    // Wait for approval or timeout (1d)
    await Promise.race([
      condition(() => approved || rejected),
      sleep('1d').then(() => {
        throw new ApplicationFailure('Failed to approve trasfer request within 1 day');
      }),
    ]);

    if (rejected || !approved) {
      await recordTransactionStatus(transactionId, 'REJECTED');
      return 'Transfer Rejected';
    }

    await recordTransactionStatus(transactionId, 'APPROVED');
  }

  //
  // 💸 Debit Sender
  //
  await debitAccount(fromAccount, amount);
  await recordTransactionStatus(transactionId, 'DEBITED');

  //
  // 🏦 Credit Receiver (with retry)
  //
  try {
    await creditAccount(toAccount, amount);
    await recordTransactionStatus(transactionId, 'CREDITED');
  } catch (error: unknown) {
    console.log(error);
    //
    // 🔁 Compensation (Saga Pattern)
    //
    await recordTransactionStatus(transactionId, 'CREDIT_FAILED');

    // Wait random 1–10 minutes before refund
    const delayMinutes = Math.floor(Math.random() * 10) + 1;
    await sleep(`${delayMinutes}m`);

    await refundAccount(fromAccount, amount);
    await recordTransactionStatus(transactionId, 'REFUNDED');

    return 'Transfer Failed — Refunded';
  }

  //
  // ✅ Completed
  //
  await recordTransactionStatus(transactionId, 'COMPLETED');

  return 'Transfer Successful';
}
