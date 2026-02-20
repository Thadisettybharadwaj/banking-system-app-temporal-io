import { SERVER_URL } from '../constants/URLs';

export async function createTransfer(data: { fromAccount: string; toAccount: string; amount: number }) {
  const res = await fetch(`${SERVER_URL}/api/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function approveTransfer(workflowId: string, decision: boolean) {
  const res = await fetch(`${SERVER_URL}/api/approve/${workflowId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision }),
  });

  return res.json();
}
