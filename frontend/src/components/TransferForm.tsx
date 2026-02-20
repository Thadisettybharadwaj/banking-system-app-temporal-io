import React, { useState } from 'react';
import { createTransfer } from '../api/transfer';
import type { CreateTransferResponseType } from '../interfaces/Interfaces';

const TransferForm: React.FC = () => {
  const [fromAccount, setFromAccount] = useState('user1');
  const [toAccount, setToAccount] = useState('user2');
  const [amount, setAmount] = useState(0);
  const [response, setResponse] = useState<CreateTransferResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requiresApproval = amount > 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createTransfer({
        fromAccount,
        toAccount,
        amount,
      });

      setResponse(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='transfer-form-container'>
      <div className='form-card'>
        <h2 className='form-title'>💸 Transfer Money</h2>

        <form onSubmit={handleSubmit} className='transfer-form'>
          <div className='form-group'>
            <label htmlFor='fromAccount'>From Account:</label>
            <input
              id='fromAccount'
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className='form-input'
              placeholder='Enter sender account'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='toAccount'>To Account:</label>
            <input
              id='toAccount'
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className='form-input'
              placeholder='Enter recipient account'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='amount'>Amount:</label>
            <input
              id='amount'
              type='number'
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className='form-input'
              placeholder='Enter amount'
              min='0'
            />
          </div>

          {requiresApproval && (
            <div className='warning-message'>
              <span className='warning-icon'>⚠️</span>
              <div className='warning-content'>
                <strong>Approval Required</strong>
                <p>This transfer of ${amount} exceeds the $500 limit and requires approval.</p>
              </div>
            </div>
          )}

          <button type='submit' className='submit-button' disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit Transfer'}
          </button>
        </form>

        {response && (
          <div className='response-message'>
            <div className='response-header'>
              <span className='success-icon'>✅</span>
              <strong>Transfer Initiated Successfully</strong>
            </div>
            <div className='response-details'>
              <p>
                <strong>Transaction ID:</strong> {response.transactionId}
              </p>
              <p>
                <strong>Workflow ID:</strong> {response.workflowId}
              </p>
              <p>
                <strong>Status:</strong> {response.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferForm;
