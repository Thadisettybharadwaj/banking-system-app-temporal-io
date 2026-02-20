import React, { useEffect, useState } from 'react';
import type { PendingTransferApprovalsListResponse } from '../interfaces/Interfaces';
import { fetchListOfPendingTransferRequests } from '../api/transfer';
import { Link } from 'react-router-dom';

const PendingApprovalsList: React.FC = () => {
  const [res, setRes] = useState<PendingTransferApprovalsListResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchListOfApprovals = async () => {
    setIsLoading(true);
    setError('');
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchListOfApprovals();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className='pending-approvals-container'>
      <div className='approvals-card'>
        <h3 className='approvals-title'>📋 Pending Transfer Requests</h3>

        {isLoading && <div className='loading-message'>Loading pending requests...</div>}

        {!isLoading && error && <div className='error-message'>❌ {error}</div>}

        {!isLoading && !error && res && res.items.length > 0 ? (
          <div className='table-container'>
            <table className='approvals-table'>
              <thead>
                <tr>
                  <th>Request #</th>
                  <th>Workflow ID</th>
                  <th>Started At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {res.items.map((eachRequest, index) => {
                  return (
                    <tr key={eachRequest.workflowId}>
                      <td>{index + 1}</td>
                      <td className='workflow-id-cell'>{eachRequest.workflowId}</td>
                      <td>{formatDate(eachRequest.startTime)}</td>
                      <td>
                        <Link to={`/transfer-details/${eachRequest.workflowId}`} className='view-link'>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && !error && <div className='empty-message'>✨ No pending transfer requests at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsList;
