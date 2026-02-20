import {
  CREATE_NEW_TRANSFER_REQUEST_URL,
  FETCH_LIST_OF_PENDING_APPROVALS_URL,
  giveIndividualApprovalReqURL,
  giveTransferRequestApprovalURL,
} from '../constants/URLs';

export async function createTransfer(data: { fromAccount: string; toAccount: string; amount: number }) {
  const res = await fetch(CREATE_NEW_TRANSFER_REQUEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function approveTransfer(workflowId: string, decision: boolean) {
  const res = await fetch(giveTransferRequestApprovalURL(workflowId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision }),
  });

  return res.json();
}

export async function fetchListOfPendingTransferRequests() {
  const res = await fetch(FETCH_LIST_OF_PENDING_APPROVALS_URL, { method: 'GET' });

  return res;
}

export async function fetchIndividualTransferRequest(workflowId: string) {
  const res = await fetch(giveIndividualApprovalReqURL(workflowId), { method: 'GET' });

  return res.json();
}
