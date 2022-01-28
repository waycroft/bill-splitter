import { Schema, model, ObjectId } from 'mongoose';
import { Transaction, TransactionModel } from './Transaction';

interface Pool {
    settledTotal: number,
    unsettledTotal: number,
    members: Array<ObjectId>,
    transactions: Array<Transaction>,
    createdAt: Date
}

const PoolSchema = new Schema<Pool>({
    settledTotal: Number,
    unsettledTotal: Number,
    members: [mongoose.ObjectId],
    transactions: [TransactionModel],
    createdAt: Date
})

export const PoolModel = model<Pool>('Pool', PoolSchema, 'pools');