import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionSchema } from './Transaction';
export interface Pool {
    _id: string;
    id: string;
    settledTotal: number,
    unsettledTotal: number,
    members: Array<string>,
    transactions: Array<Transaction>,
    createdAt: Date
}

const PoolSchema = new Schema<Pool>({
    id: {
        type: String,
        required: true,
        default: uuidv4()
    },
    settledTotal: {
        type: Number,
        default: 0
    },
    unsettledTotal: {
        type: Number,
        default: 0
    },
    members: [{
        firstName: String,
        lastName: String,
        _id: Schema.Types.ObjectId
    }],
    transactions: [TransactionSchema],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export const PoolModel = model<Pool>('Pool', PoolSchema, 'pools');