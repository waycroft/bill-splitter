import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
    _id: string;
    id: string;
    date: Date;
    owner: string;
    amount: number;
    category: string,
    memo: string;
    payees: Array<string>;
}

export const TransactionSchema = new Schema<Transaction>({
    id: {
        type: String,
        required: true,
        default: uuidv4()
    },
    date: Date,
    owner: Schema.Types.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [Schema.Types.ObjectId]
})

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema, 'transactions');