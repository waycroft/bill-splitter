const mongoose = require('mongoose');
import { Schema, model } from 'mongoose';

interface Transaction {
    payer: string;
    amount: number;
    date: Date;
    memo: string;
    payees: string[];
}

const TransactionSchema = new Schema<Transaction>({
    payer: String, //make objID
    amount: Number,
    date: Date,
    memo: String,
    payees: [String] // array of ObjIds
})

export const Transaction = model<Transaction>('Transaction', TransactionSchema, 'transactions');