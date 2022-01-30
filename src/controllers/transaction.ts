import { HydratedDocument } from 'mongoose';
import { Transaction, TransactionModel } from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';
import { Pool, PoolModel } from '../models/Pool.js';
import { getObjId } from '../helpers/exchange_id.js';

export async function createTransaction(pool_id: string, transactionData: Transaction) {
    let freshId = uuidv4();
    
    // todo: turn "getObjId" into a function that traverses a whole object,
    // scans for any uuids, and fetches the respective ObjIds. 
    // to prevent having to call it multiple times on the same collection. 
    transactionData.owner = await getObjId("users", transactionData.owner);
    transactionData.payees = await Promise.all(transactionData.payees.map(async uuid => {
        return await getObjId("users", uuid);
    }))
    
    let transaction: HydratedDocument<Transaction> = new TransactionModel({
        id: freshId,
        ...transactionData
    });
    await transaction.save();

    let pool: HydratedDocument<Pool> | null = await PoolModel.findOne({ id: pool_id });
    if (pool && pool.transactions) {
        if (pool.transactions.length >= 25) {
            pool.transactions.shift();
        }
        pool.transactions.push(transaction);
        await pool.save();
    }
    
    return transaction;
}