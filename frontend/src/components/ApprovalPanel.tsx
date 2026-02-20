import React, { useState } from 'react';
import { approveTransfer } from '../api/transfer';

const ApprovalPanel: React.FC = () => {
  const [workflowId, setWorkflowId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (decision: boolean) => {
    if (!workflowId.trim()) {
      setMessageType('error');
      setMessage('Please enter a valid Workflow ID');
      return;
    }

    setIsLoading(true);
    try {
      const result = await approveTransfer(workflowId, decision);
      setMessageType('success');
      setMessage(result.message || `Transfer ${decision ? 'approved' : 'rejected'} successfully`);
      setWorkflowId('');
    } catch (err) {
      setMessageType('error');
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='approval-panel-container'>
      <div className='approval-card'>
        <h2 className='approval-title'>⏳ Transfer Approval</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className='approval-form'
        >
          <div className='form-group'>
            <label htmlFor='workflowId'>Workflow ID:</label>
            <input
              id='workflowId'
              placeholder='Enter the transfer workflow ID'
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              className='form-input'
              disabled={isLoading}
            />
          </div>

          <div className='button-group'>
            <button
              type='button'
              onClick={() => handleDecision(true)}
              className='approve-button'
              disabled={isLoading || !workflowId.trim()}
            >
              ✅ Approve
            </button>

            <button
              type='button'
              onClick={() => handleDecision(false)}
              className='reject-button'
              disabled={isLoading || !workflowId.trim()}
            >
              ❌ Reject
            </button>
          </div>
        </form>

        {message && (
          <div className={`message ${messageType}`}>
            {messageType === 'success' && <span className='message-icon'>✓</span>}
            {messageType === 'error' && <span className='message-icon'>✕</span>}
            <span className='message-text'>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalPanel;
