import mongoose, { Schema, Types, model } from "mongoose";
import type { Model } from "mongoose";
import { LeanUser, LeanUserSchema } from "./UserSchema";

export interface SplitItem {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  payees: LeanUser[]
}

export const SplitItemSchema = new mongoose.Schema<SplitItem>({
  name: String,
  amount: Number,
  payees: [LeanUserSchema]
})
export interface PayeeData {
  _id: Types.ObjectId;
  total_amount: number;
  items: SplitItem[];
}

export const PayeeDataSchema = new mongoose.Schema<PayeeData>({
  total_amount: Number,
  items: [SplitItemSchema]
})
export interface Transaction {
  _id?: Types.ObjectId;
  transaction_date: Date;
  created_at: Date;
  total: number;
  owner: Types.ObjectId;
  owner_amount: number;
  category: string;
  memo: string;
  payees: PayeeData[];
}

export const TransactionSchema = new Schema<Transaction>({
  created_at: {
    type: Date,
    default: new Date(),
  },
  transaction_date: {
    type: Date,
    default: new Date(),
  },
  total: Number,
  owner: Schema.Types.ObjectId,
  owner_amount: Number,
  category: String,
  memo: String,
  payees: [Schema.Types.Mixed],
});

export interface TransactionRequest {
  pool_id: string;
  transaction: Transaction;
}

export interface TransactionBucket {
  _id: Types.ObjectId;
  pool_id: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  transactions: Transaction[];
  transactions_size: number;
  created_at: Date;
}

export const TransactionBucketSchema = new Schema<TransactionBucket>({
  pool_id: Schema.Types.ObjectId,
  start_date: Date,
  end_date: Date,
  transactions: [TransactionSchema],
  transactions_size: Number,
});

export const TransactionBucketModel: Model<TransactionBucket> =
  mongoose.models?.TransactionBucket ??
  model("TransactionBucket", TransactionBucketSchema, "transactions");
