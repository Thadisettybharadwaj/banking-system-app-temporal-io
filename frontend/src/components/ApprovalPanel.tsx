import React, { useState } from 'react';
import { approveTransfer } from '../api/transfer';

const ApprovalPanel: React.FC = () => {
  const [workflowId, setWorkflowId] = useState('');
  const [message, setMessage] = useState('');

  const handleDecision = async (decision: boolean) => {
    const result = await approveTransfer(workflowId, decision);
    setMessage(result.message);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20 }}>
      <h2>⏳ Approve Transfer</h2>

      <input placeholder='Enter workflowId' value={workflowId} onChange={(e) => setWorkflowId(e.target.value)} />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => handleDecision(true)}>✅ Approve</button>

        <button onClick={() => handleDecision(false)}>❌ Reject</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ApprovalPanel;
