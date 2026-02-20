import React, { useState } from 'react';
import { approveTransfer } from '../api/transfer';

interface ApprovalPanelProps {
  workflowId: string;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ workflowId }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (decision: boolean) => {
    setIsLoading(true);
    try {
      const result = await approveTransfer(workflowId, decision);
      setMessageType('success');
      setMessage(result.message || `Transfer ${decision ? 'approved' : 'rejected'} successfully`);
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
