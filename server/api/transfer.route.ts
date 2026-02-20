import express from 'express';
import { Client } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { transferWorkflow } from '../temporal/workflows/transfer.workflow';
import { buildError } from '../utils/helpers';

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
    const message = buildError(error)?.message ?? 'Error while transfering amount';
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
    const message = buildError(error)?.message ?? 'Error while approving transfer amount';
    res.status(500).json({ error: message });
  }
});

/** Pending Transfer Requests */
router.get('/pending-approvals-list', async (_req, res) => {
  try {
    const workflows = [];

    const queryRes = client.workflow.list({ query: 'WorkflowType="transferWorkflow" AND ExecutionStatus="Running"' });

    for await (const item of queryRes) {
      workflows.push({
        workflowId: item.workflowId,
        runId: item.runId,
        startTime: item.startTime,
      });
    }

    res.json({ status: 200, items: workflows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: buildError(error)?.message });
  }
});

router.get('/approval-transfer-details/:workflowId', async (req, res) => {
  const { workflowId } = req.params;

  try {
    const handle = client.workflow.getHandle(workflowId);

    // 1️⃣ Get metadata
    const description = await handle.describe();

    // 2️⃣ Get workflow business state
    const details = await handle.query('getTransferDetails');

    res.json({
      workflowId,
      runId: description.runId,
      startTime: description.startTime,
      status: description.status.name,
      businessData: details,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: buildError(error)?.message });
  }
});

export default router;
