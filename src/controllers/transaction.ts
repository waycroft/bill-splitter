import { Transaction, TransactionBucketModel } from '../models/Transaction.js';
import { PoolModel } from '../models/Pool.js';

export async function upsertTransaction(transactionData: Transaction) {
    await updatePoolsTransactions(transactionData);
    await addTransactionToBucket(transactionData);
}

async function updatePoolsTransactions(transactionData: Transaction) {
    let pool = await PoolModel.findOne(
        { _id: transactionData.pool_id }
    );
    if (pool && pool.transactions.length >= 25) {
        pool.transactions.shift();
    }
    if (pool) {
        pool.transactions.push(transactionData);
        await pool.save();
    }
}

async function addTransactionToBucket(transactionData: Transaction) {
    let transactionBucket = await TransactionBucketModel.findOne(
        { pool_id: transactionData.pool_id, transactions_size: { $lt: 50 } }
    );
    if (transactionBucket != null) {
        delete transactionData.pool_id;
        transactionBucket.transactions.push(transactionData);
    }
}
