import mongoose, { Schema, Types, model } from "mongoose";
import { TransactionInProgressSchema } from "./TransactionSchema";

import type { TransactionInProgress } from "./TransactionSchema";
import type { Model } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  last_login_at: Date;
  pools: Types.ObjectId[];
  transactions: Types.ObjectId[];
  total_owed: number;
  total_owes: number;
  transaction_in_progress: TransactionInProgress
}

export type LeanUser = Pick<User, "_id" | "first_name" | "last_name"> & { balance?: number };

export const LeanUserSchema = new Schema<LeanUser>({
  first_name: String,
  last_name: String,
  balance: {
    required: false,
    type: Number,
    default: 0
  }
})

const UserSchema = new Schema<User>({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  created_at: {
    type: Date,
    default: new Date(),
  },
  last_login_at: {
    type: Date,
    default: new Date(),
  },
  pools: [Schema.Types.ObjectId],
  transactions: [Schema.Types.ObjectId],
  total_owed: Number,
  total_owes: Number,
  transaction_in_progress: TransactionInProgressSchema
});

export const UserModel: Model<User> =
  mongoose.models?.User ?? model("User", UserSchema, "users");
