import { Schema, model, ObjectId } from 'mongoose';

export interface Transaction {
    date: Date;
    owner: ObjectId;
    amount: number;
    category: string,
    memo: string;
    payees: Array<ObjectId>;
}

const TransactionSchema = new Schema<Transaction>({
    date: Date,
    owner: mongoose.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [mongoose.ObjectId]
})

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema, 'transactions');