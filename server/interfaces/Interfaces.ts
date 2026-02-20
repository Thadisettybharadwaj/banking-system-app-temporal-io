export enum TransactionStatus {
  INITIATED,
  AWAITING_APPROVAL,
  APPROVED,
  REJECTED,
  DEBITED,
  CREDITED,
  REFUNDED,
  FAILED,
  COMPLETED
}

export interface UserAccountType {
    id: string;
    name: string;
    balance: number
}

export interface TransferInput {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
}