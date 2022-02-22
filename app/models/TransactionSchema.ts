import mongoose, { Schema, ObjectId, model } from "mongoose";
import type { Model } from "mongoose";

export interface PayeeData {
  _id: ObjectId;
  amount: number;
}
export interface Transaction {
  _id: ObjectId;
  date: Date;
  total: number;
  owner: ObjectId;
  owner_amount: number;
  amount: number;
  category: string;
  memo: string;
  payees: Array<PayeeData>;
}

export interface TransactionRequest {
  pool_id: ObjectId;
  transaction: Transaction;
}

export interface TransactionBucket {
  _id: ObjectId;
  pool_id: ObjectId;
  start_date: Date;
  end_date: Date;
  transactions: Array<Transaction>;
  transactions_size: number;
}

export const TransactionSchema = new Schema<Transaction>({
  date: {
    type: Date,
    default: new Date(),
  },
  total: Number,
  owner: Schema.Types.ObjectId,
  owner_amount: Number,
  amount: Number,
  category: String,
  memo: String,
  payees: [Schema.Types.Mixed],
});

export const TransactionBucketSchema = new Schema<TransactionBucket>({
  pool_id: Schema.Types.ObjectId,
  start_date: Date,
  end_date: Date,
  transactions: [TransactionSchema],
  transactions_size: Number,
});

export const TransactionBucketModel: Model<TransactionBucket> =
  mongoose.models.TransactionBucket ||
  model("TransactionBucket", TransactionBucketSchema, "transactions");
