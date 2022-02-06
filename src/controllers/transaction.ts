import { Transaction } from '../models/Transaction.js';
import { Pool, PoolModel } from '../models/Pool.js';
import { upsertDocument } from '../helpers/upsert.js';
import { getObjId } from '../helpers/exchange_id.js';
import { HydratedDocument } from 'mongoose';

export async function upsertTransaction(transactionData: Transaction) {
    let pool: HydratedDocument<Pool> | null = await PoolModel.findOne(
        { _id: await getObjId<Pool>('pools', transactionData.poolId) }
    );
    if (pool && pool.transactions.length >= 25) {
        pool.transactions.shift();
    } 
    if (pool) {
        pool.transactions.push(transactionData)
        await pool.save();
    }
    
    return await upsertDocument<Transaction>(transactionData, { collectionName: "transactions" });
}