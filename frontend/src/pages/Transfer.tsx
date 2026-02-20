import React from 'react';
import TransferForm from '../components/TransferForm';
import ApprovalPanel from '../components/ApprovalPanel';
import PendingApprovalsList from '../components/PendingApprovalsList';

const Transfer: React.FC = () => {
  return (
    <div className='transfer-page'>
      <div className='page-header'>
        <h1>🏦 Banking Dashboard</h1>
        <p className='page-subtitle'>Manage your transfers and approvals securely</p>
      </div>

      <div className='dashboard-layout'>
        <div className='dashboard-section'>
          <TransferForm />
        </div>

        <div className='dashboard-section'>
          <ApprovalPanel />
        </div>

        <div className='dashboard-section full-width'>
          <PendingApprovalsList />
        </div>
      </div>
    </div>
  );
};

export default Transfer;
