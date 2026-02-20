export const BASE_SERVER_URL = 'http://localhost:3001/api';

/** GET Request */
export const FETCH_SERVER_HEALTH_STATUS = `${BASE_SERVER_URL}/health`;

/** Create a new Transfer Request */
export const CREATE_NEW_TRANSFER_REQUEST_URL = `${BASE_SERVER_URL}/transfer`;

/** Approve a Transfer Request */
export const giveTransferRequestApprovalURL = (workflowId: string) => {
  return `${BASE_SERVER_URL}/approve/${workflowId}`;
};

/** Fetch List of Pending Approvals */
export const FETCH_LIST_OF_PENDING_APPROVALS_URL = `${BASE_SERVER_URL}/pending-approvals-list`;

/** Fetch Individual Approval Data */
export const giveIndividualApprovalReqURL = (workflowId: string) => {
  return `${BASE_SERVER_URL}/approval-transfer-details/${workflowId}`;
};
