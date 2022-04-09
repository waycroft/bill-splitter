import mongoose, { Schema, Types, model } from "mongoose";
import type { Model } from "mongoose";

export interface SplitItem {
  _id?: Types.ObjectId;
  name: string;
  amount: number;
}

export const SplitItemSchema = new mongoose.Schema<SplitItem>({
  name: String,
  amount: Number,
})
export interface PayeeData {
  user_id?: Types.ObjectId;
  items?: SplitItem[];
  total_amount: number;
}

export const PayeeDataSchema = new mongoose.Schema<PayeeData>({
  user_id: Schema.Types.ObjectId,
  total_amount: Number,
  items: [SplitItemSchema],
})
export interface Transaction {
  _id?: Types.ObjectId;
  // pool_id is really only a virtual property for doing db actions, it is not saved to the Transaction subdocument in db.
  pool_id: Types.ObjectId;
  transaction_date: Date;
  created_at: Date;
  total: number;
  owner: Types.ObjectId;
  category: string;
  memo: string;
  payees: PayeeData[];
  split_evenly: boolean;
}

export type TransactionInProgress = Partial<Transaction> & { step?: number };

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
  category: String,
  memo: String,
  payees: [PayeeDataSchema],
});

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
