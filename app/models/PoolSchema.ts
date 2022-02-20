import mongoose, { Schema, model } from 'mongoose';
import { TransactionSchema } from './TransactionSchema';
import { LeanUser } from './UserSchema';

import type { Model } from 'mongoose';
import type { Transaction } from './TransactionSchema';
export interface Pool {
    _id: string;
    settled_total: number,
    unsettled_total: number,
    members: Array<LeanUser>,
    transactions: Array<Transaction>,
    created_at: Date
}

export const PoolSchema = new Schema<Pool>({
    settled_total: {
        type: Number,
        default: 0
    },
    unsettled_total: {
        type: Number,
        default: 0
    },
    members: [Schema.Types.Mixed],
    transactions: {
        type: [TransactionSchema],
        default: []
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

export const PoolModel: Model<Pool> = mongoose.models.Pool || model('Pool', PoolSchema, 'pools')