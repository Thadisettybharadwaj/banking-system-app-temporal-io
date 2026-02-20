import express from 'express';
import { Client } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { transferWorkflow } from '../temporal/workflows/transfer.workflow';

const router = express.Router();

// Create Temporal client (connects to running Temporal server)
const client = new Client();

//
// 🏦 POST /transfer
//
router.post('/transfer', async (req, res) => {
  try {
    const { fromAccount, toAccount, amount } = req.body;

    const transactionId = randomUUID();

    const handle = await client.workflow.start(transferWorkflow, {
      args: [
        {
          transactionId,
          fromAccount,
          toAccount,
          amount,
        },
      ],
      taskQueue: 'transfer-queue',
      workflowId: `transfer-${transactionId}`,
    });

    res.json({
      message: 'Transfer initiated',
      transactionId,
      workflowId: handle.workflowId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error while transfering amount';
    res.status(500).json({ error: message });
  }
});

//
// 🏦 POST /approve/:workflowId
//
router.post('/approve/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { decision } = req.body; // true or false

    const handle = client.workflow.getHandle(workflowId);

    await handle.signal('approveTransfer', decision);

    res.json({
      message: decision ? 'Transfer approved' : 'Transfer rejected',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error while approving transfer amount';
    res.status(500).json({ error: message });
  }
});

export default router;
