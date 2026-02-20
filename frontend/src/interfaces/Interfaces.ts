/**
 * Interfaces that are created here, will be used across the frontend app
 */

export interface Test {
  type: string;
}

export interface TransferResponseType {
  message: string;
  transactionId: string;
  workflowId: string;
}
