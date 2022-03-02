import mongoose, { Schema, Types, model } from "mongoose";
import type { Model } from "mongoose";
import type { Transaction } from "./TransactionSchema";

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
  current_transaction_input: Partial<Transaction>
}

export type LeanUser = Pick<User, "_id" | "first_name" | "last_name">;

export const LeanUserSchema = new Schema<LeanUser>({
  first_name: String,
  last_name: String
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
});

export const UserModel: Model<User> =
  mongoose.models?.User ?? model("User", UserSchema, "users");
