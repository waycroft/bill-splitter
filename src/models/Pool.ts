import { Schema, model } from 'mongoose';
import { Transaction, TransactionSchema } from './Transaction';
import { LeanUser } from './User';

export interface Pool {
    _id: string;
    settled_total: number,
    unsettled_total: number,
    members: Array<LeanUser>,
    transactions: Array<Transaction>,
    created_at: Date
}

const PoolSchema = new Schema<Pool>({
    settled_total: {
        type: Number,
        default: 0
    },
    unsettled_total: {
        type: Number,
        default: 0
    },
    members: [Schema.Types.Mixed],
    transactions: [TransactionSchema],
    created_at: {
        type: Date,
        default: new Date()
    }
})

export const PoolModel = model<Pool>('Pool', PoolSchema, 'pools');