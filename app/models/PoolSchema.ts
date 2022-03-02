import mongoose, { Schema, Types, model } from "mongoose";
import { TransactionSchema } from "./TransactionSchema";
import { LeanUserSchema } from "./UserSchema";

import type { LeanUser } from "./UserSchema";
import type { Model } from "mongoose";
import type { Transaction } from "./TransactionSchema";
export interface Pool {
  _id: Types.ObjectId;
  settled_total: number;
  unsettled_total: number;
  members: LeanUser[];
  transactions: Transaction[];
  created_at: Date;
}

export const PoolSchema = new Schema<Pool>({
  settled_total: {
    type: Number,
    default: 0,
  },
  unsettled_total: {
    type: Number,
    default: 0,
  },
  members: [LeanUserSchema],
  transactions: {
  type: [TransactionSchema],
    default: [],
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

export const PoolModel: Model<Pool> =
  mongoose.models?.Pool ?? model("Pool", PoolSchema, "pools");
