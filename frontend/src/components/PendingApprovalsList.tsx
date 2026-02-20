import React, { useEffect, useState } from 'react';
import type { PendingTransferApprovalsListResponse } from '../interfaces/Interfaces';
import { fetchListOfPendingTransferRequests } from '../api/transfer';

const PendingApprovalsList: React.FC = () => {
  const [res, setRes] = useState<PendingTransferApprovalsListResponse | null>(null);
  const [error, setError] = useState('');

  const fetchListOfApprovals = async () => {
    try {
      const response = await fetchListOfPendingTransferRequests();

      if (!response.ok) {
        throw new Error('Error while fetching list of pending transfer requests...');
      }

      const data = (await response.json()) as PendingTransferApprovalsListResponse;
      setRes(data);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : 'Error!');
    }
  };

  useEffect(() => {
    void fetchListOfApprovals();
  }, []);

  return (
    <div>
      <h3>List of Transfer Request Approvals</h3>
      {!error
        ? res?.items.map((eachRequest) => {
            return (
              <ul>
                <li>
                  Started At == {eachRequest.startTime} & Workflow ID == {eachRequest.workflowId}
                </li>
              </ul>
            );
          })
        : error}
    </div>
  );
};

export default PendingApprovalsList;
