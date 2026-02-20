import React from 'react';
import TransferForm from '../components/TransferForm';
import ApprovalPanel from '../components/ApprovalPanel';
import PendingApprovalsList from '../components/PendingApprovalsList';

const Transfer: React.FC = () => {
  return (
    <div style={{ padding: 40 }}>
      <h1>🏦 Banking Dashboard</h1>

      <TransferForm />
      <br />
      <ApprovalPanel />
      <br />
      <PendingApprovalsList />
    </div>
  );
};

export default Transfer;
