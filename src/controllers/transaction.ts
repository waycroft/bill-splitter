import { Document } from 'mongoose';
import { Transaction, TransactionModel } from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

export async function createTransaction(pool_id: string, transactionData: Transaction) {
    let freshId = uuidv4();
    let transaction: Document<Transaction> = new TransactionModel({
        id: freshId,
        ...transactionData
    });
    await transaction.save();

    // todo: push to pool's transactions. if 25 transactions, then pop oldest and push newest
    
    return transaction;
}