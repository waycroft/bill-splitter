import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface PayeeData {
    id: string;
    amount: number;
}
export interface Transaction {
    poolId: string;
    bucketCounter: number;
    _id: string;
    id: string;
    date: Date;
    owner: string;
    amount: number;
    category: string;
    memo: string;
    payees: Array<string>;
}

export const TransactionSchema = new Schema<Transaction>({
    poolId: Schema.Types.ObjectId,
    bucketCounter: Number,
    id: {
        type: String,
        required: true,
        default: uuidv4()
    },
    date: {
        type: Date,
        default: new Date()
    },
    owner: Schema.Types.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [Schema.Types.ObjectId]
})

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema, 'transactions');