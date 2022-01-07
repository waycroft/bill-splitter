const mongoose = require('mongoose');
import { Schema } from 'mongoose';

export interface Transaction {
    payer: string;
    amount: number;
    date: Date;
    memo: string;
    payees: string[];
}

export const TransactionSchema = new Schema<Transaction>({
    payer: mongoose.ObjectId,
    amount: Number,
    date: Date,
    memo: String,
    payees: [mongoose.ObjectId]
})