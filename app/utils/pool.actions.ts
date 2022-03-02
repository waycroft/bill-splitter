import { PoolModel } from "~/models/PoolSchema";
import invariant from "tiny-invariant";
import { isValidObjectId, ObjectId } from "mongoose";

import type { LeanUser } from "~/models/UserSchema";

export async function getPools() {
  return await PoolModel.find().lean();
}

export async function getPool(_id: string) {
  return await PoolModel.findOne({ _id: _id }).lean();
}

export async function upsertPool(
  // todo: bug: lean users are being saved to members field with string object ids instead of real ones
  members: LeanUser[],
  poolId: string | null = null
) {
  if (!poolId) {
    const existingPool = await PoolModel.findOne({
      members: { $all: members },
    });
    if (!existingPool) {
      const pool = new PoolModel({
        members: members,
      });
      const newPool = await pool.save();
      // todo: feature: update user pools field
      return newPool;
    } else {
      existingPool.members = members;
      const newPool = await existingPool.save();
      // todo: feature: update user pools field
      return newPool;
    }

  }

  invariant(isValidObjectId(poolId), "Pool ID was not a valid Object ID");
  let pool = await PoolModel.findOne({ _id: poolId });
  if (pool != null) {
    pool.members = members;
    // todo: feature: update user pools field
    return await pool.save();
  } else {
    throw "Error with upsertPool, pool was likely deleted";
  }
}

export async function deletePool(poolId: string) {
  invariant(isValidObjectId(poolId), "Pool ID was not a valid Object ID");
  // todo: some hook that deletes corresponding transactions in buckets? 
  // or maybe pools can never be fully deleted, but merely archived...?
  let writeOp = await PoolModel.deleteOne({ _id: poolId });
  return writeOp;
}
