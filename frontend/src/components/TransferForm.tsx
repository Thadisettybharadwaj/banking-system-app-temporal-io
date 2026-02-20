import React, { useState } from 'react';
import { createTransfer } from '../api/transfer';
import type { CreateTransferResponseType } from '../interfaces/Interfaces';

const TransferForm: React.FC = () => {
  const [fromAccount, setFromAccount] = useState('user1');
  const [toAccount, setToAccount] = useState('user2');
  const [amount, setAmount] = useState(0);
  const [response, setResponse] = useState<CreateTransferResponseType | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createTransfer({
      fromAccount,
      toAccount,
      amount,
    });

    setResponse(result);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20 }}>
      <h2>💸 Transfer Money</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>From:</label>
          <input value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} />
        </div>

        <div>
          <label>To:</label>
          <input value={toAccount} onChange={(e) => setToAccount(e.target.value)} />
        </div>

        <div>
          <label>Amount:</label>
          <input type='number' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>

        <button type='submit'>Transfer</button>
      </form>

      {response && (
        <div style={{ marginTop: 10 }}>
          <strong>Response:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TransferForm;
