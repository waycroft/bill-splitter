import { Schema, model, ObjectId } from 'mongoose';
import { Transaction, TransactionSchema } from './Transaction';

export interface Pool {
    settledTotal: number,
    unsettledTotal: number,
    members: Array<ObjectId>,
    transactions: Array<Transaction>,
    createdAt: Date
}

const PoolSchema = new Schema<Pool>({
    settledTotal: Number,
    unsettledTotal: Number,
    members: [Schema.Types.ObjectId],
    transactions: [TransactionSchema],
    createdAt: Date
})

export const PoolModel = model<Pool>('Pool', PoolSchema, 'pools');