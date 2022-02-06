import { Schema, model } from 'mongoose';

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
    payees: Array<PayeeData>;
}

// transactions will be stored in buckets by pool / bucket number. 50 transactions per bucket. 
export const TransactionSchema = new Schema<Transaction>({
    poolId: Schema.Types.ObjectId,
    bucketCounter: Number,
    date: {
        type: Date,
        default: new Date()
    },
    owner: Schema.Types.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [Schema.Types.ObjectId] // todo: payee data schema
})

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema, 'transactions');