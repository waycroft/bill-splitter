import { Schema, model, ObjectId } from 'mongoose';

export interface Transaction {
    date: Date;
    owner: ObjectId;
    amount: number;
    category: string,
    memo: string;
    payees: Array<ObjectId>;
}

export const TransactionSchema = new Schema<Transaction>({
    date: Date,
    owner: Schema.Types.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [Schema.Types.ObjectId]
})

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema, 'transactions');