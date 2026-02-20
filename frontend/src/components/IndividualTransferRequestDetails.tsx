import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIndividualTransferRequest } from '../api/transfer';
import type { PendingApprovalRequest } from '../interfaces/Interfaces';

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

  return (
    <div>
      <h4>Transfer Details of {id}</h4>

      {loading && <p>Loading…</p>}

      {!loading && error && <p className='error'>{error}</p>}

      {!loading && !error && data && (
        <ul>
          <li>Started At: {data.metaData.startTime}</li>
          <li>Workflow ID: {data.metaData.workflowId}</li>
          <li>Status : {data.metaData.status}</li>

          <li>From Account At: {data.businessData.fromAccount}</li>
          <li>To Account At: {data.businessData.toAccount}</li>
          <li>Transaction ID: {data.businessData.transactionId}</li>
          <li>Amount: {data.businessData.amount}</li>
        </ul>
      )}
    </div>
  );
};

export default IndividualTransferRequestDetails;
