import { HydratedDocument } from 'mongoose';
import { Transaction, TransactionModel } from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';
import { Pool, PoolModel } from '../models/Pool.js';
import { getObjId } from '../helpers/exchange_id.js';
import { upsertDocument } from '../helpers/upsert.js';

export async function upsertTransaction(transactionData: Transaction) {
    return await upsertDocument('transactions', "_id", transactionData);
}