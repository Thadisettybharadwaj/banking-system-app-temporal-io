import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { UserAccountType } from "../../interfaces/Interfaces";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accountsPath = path.join(__dirname, "../../data/accounts.json");

// Utility to load accounts
async function loadAccounts() {
  const data = await fs.readFile(accountsPath, "utf-8");
  return JSON.parse(data) as UserAccountType[];
}

// Utility to save accounts
async function saveAccounts(accounts: UserAccountType[]) {
  await fs.writeFile(accountsPath, JSON.stringify(accounts, null, 2));
}

// 🔹 Debit Account
export async function debitAccount(accountId: string, amount: number) {
  const accounts = await loadAccounts();
  const account = accounts.find((a) => a.id === accountId);

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.balance < amount) {
    throw new Error("Insufficient funds");
  }

  account.balance -= amount;

  await saveAccounts(accounts);

  console.log(`💸 Debited ${amount} from ${accountId}`);
  return true;
}

// 🔹 Credit Account
export async function creditAccount(accountId: string, amount: number) {
  const accounts = await loadAccounts();
  const account = accounts.find((a) => a.id === accountId);

  if (!account) {
    throw new Error("Receiver account not found");
  }

  // 🔥 Simulate random failure (30% chance)
  if (Math.random() < 0.3) {
    console.log("⚠️ Simulated credit failure");
    throw new Error("Credit failed due to banking error");
  }

  account.balance += amount;

  await saveAccounts(accounts);

  console.log(`🏦 Credited ${amount} to ${accountId}`);
  return true;
}

// 🔹 Refund Account
export async function refundAccount(accountId: string, amount: number) {
  const accounts = await loadAccounts();
  const account = accounts.find((a) => a.id === accountId);

  if (!account) {
    throw new Error("Refund account not found");
  }

  account.balance += amount;

  await saveAccounts(accounts);

  console.log(`🔁 Refunded ${amount} to ${accountId}`);
  return true;
}

// 🔹 Record Transaction Status (for logging)
export async function recordTransactionStatus(
  transactionId: string,
  status: string
) {
  console.log(`📌 Transaction ${transactionId} → ${status}`);
  return true;
}