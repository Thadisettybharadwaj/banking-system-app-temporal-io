/**
 * Interfaces that are created here, will be used across the frontend app
 */

import type { WorkflowExecutionStatusName } from '@temporalio/client';

export interface Test {
  type: string;
}

export interface CreateTransferResponseType {
  message: string;
  transactionId: string;
  workflowId: string;
}

/**
 * List of Pending Approvals Type Def.
 */

export interface PendingTransferApprovalListMetadata {
  workflowId: string;
  runId: string;
  startTime: string;
}

export interface PendingTransferApprovalsListResponse {
  status: number;
  items: PendingTransferApprovalListMetadata[];
}

/**
 * Individual Pending Approval Types
 */

interface IndividualTransferApprovalMetaDataType {
  workflowId: string;
  runId: string;
  startTime: string;
  status: WorkflowExecutionStatusName;
}

interface IndividualTransferApprovalBusinessDataType {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
}

export interface PendingApprovalRequest {
  metaData: IndividualTransferApprovalMetaDataType;
  businessData: IndividualTransferApprovalBusinessDataType;
}
