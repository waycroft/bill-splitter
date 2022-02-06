import { Transaction } from '../models/Transaction.js';
import { upsertDocument } from '../helpers/upsert.js';

export async function upsertTransaction(transactionData: Transaction) {
    return await upsertDocument<Transaction>(transactionData, { collectionName: "transactions" });
}