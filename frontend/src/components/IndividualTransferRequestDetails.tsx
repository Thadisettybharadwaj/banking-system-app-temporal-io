import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIndividualTransferRequest } from '../api/transfer';
import type { PendingApprovalRequest } from '../interfaces/Interfaces';
import ApprovalPanel from './ApprovalPanel';

const IndividualTransferRequestDetails: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<PendingApprovalRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { workflowId: id } = useParams<{ workflowId: string }>();

  const fetchData = React.useCallback(
    async (signal: AbortSignal) => {
      setError('');
      setLoading(true);

      try {
        const res = await fetchIndividualTransferRequest(id ?? '');

        if (!res.ok) {
          throw new Error(`Error while fetching Status of Transfer Request with ID: ${id}`);
        }

        const json = await res.json();

        if (!signal.aborted) {
          setData({
            businessData: json.businessData,
            metaData: {
              runId: json.runId,
              startTime: json.startTime,
              status: json.status,
              workflowId: json.workflowId,
            },
          });
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error(err);
          setError(err instanceof Error ? err.message : 'Error!');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const getStatusColor = (status: string) => {
    const statusColor: { [key: string]: string } = {
      RUNNING: '#ffc107',
      COMPLETED: '#28a745',
      FAILED: '#dc3545',
      CANCELED: '#6c757d',
    };
    return statusColor[status] || '#667eea';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className='details-container'>
      <div className='details-card'>
        <h2 className='details-title'>📋 Transfer Request Details</h2>

        {loading && <div className='loading-message'>Loading transfer details...</div>}

        {!loading && error && <div className='error-message'>❌ {error}</div>}

        {!loading && !error && data && (
          <div className='details-content'>
            <div className='details-section'>
              <h3 className='section-title'>Transfer Information</h3>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Transaction ID:</label>
                  <p className='detail-value'>{data.businessData.transactionId}</p>
                </div>
                <div className='detail-item'>
                  <label>Amount:</label>
                  <p className='detail-value amount'>${data.businessData.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <h3 className='section-title'>Account Information</h3>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>From Account:</label>
                  <p className='detail-value'>{data.businessData.fromAccount}</p>
                </div>
                <div className='detail-item'>
                  <label>To Account:</label>
                  <p className='detail-value'>{data.businessData.toAccount}</p>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <h3 className='section-title'>Request Status</h3>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Workflow ID:</label>
                  <p className='detail-value workflow-id'>{data.metaData.workflowId}</p>
                </div>
                <div className='detail-item'>
                  <label>Run ID:</label>
                  <p className='detail-value'>{data.metaData.runId}</p>
                </div>
                <div className='detail-item'>
                  <label>Status:</label>
                  <p className='detail-value status' style={{ color: getStatusColor(data.metaData.status) }}>
                    {data.metaData.status}
                  </p>
                </div>
                <div className='detail-item'>
                  <label>Started At:</label>
                  <p className='detail-value'>{formatDate(data.metaData.startTime)}</p>
                </div>
              </div>
            </div>

            <ApprovalPanel workflowId={id ?? ''} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualTransferRequestDetails;
