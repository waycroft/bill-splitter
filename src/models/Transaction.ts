import { Schema, model } from 'mongoose';

export interface PayeeData {
    id: string;
    amount: number;
}
export interface Transaction {
    _id: string;
    date: Date;
    total: number;
    owner: string;
    owner_amount: number;
    amount: number;
    category: string;
    memo: string;
    payees: Array<PayeeData>;
}

export interface TransactionRequest {
    pool_id: string;
    transaction: Transaction
}

export interface TransactionBucket {
    _id: string;
    pool_id: string;
    start_date: Date;
    end_date: Date;
    transactions: Array<Transaction>;
    transactions_size: number;
}

export const TransactionSchema = new Schema<Transaction>({
    date: {
        type: Date,
        default: new Date()
    },
    total: Number,
    owner: Schema.Types.ObjectId,
    owner_amount: Number,
    amount: Number,
    category: String,
    memo: String,
    payees: [Schema.Types.Mixed]
})

export const TransactionBucketSchema = new Schema<TransactionBucket>({
    pool_id: Schema.Types.ObjectId,
    start_date: Date,
    end_date: Date,
    transactions: [TransactionSchema],
    transactions_size: Number
})

export const TransactionBucketModel = model<TransactionBucket>('TransactionBucket', TransactionBucketSchema, 'transactions');