import { PoolModel } from "~/models/PoolSchema";
import invariant from "tiny-invariant";
import { isValidObjectId } from "mongoose";

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

export type UsersBalancesMap = Map<string, number>;

async function updateUsersBalances(
  pool_id: string,
  updateValues: UsersBalancesMap
) {
  const pool = await PoolModel.findOne({ id: pool_id });
  invariant(pool, "Pool not found in updateUsersBalances");
  for (let i = 0; i < pool.members.length; i++) {
    const _id = pool.members[i];
    const amount = updateValues.get(_id.toString());
    invariant(amount, `No amount value was stored for ${_id.toString()}`);
    pool.members[i].balance += amount;
  }
  return await pool.save();
}

async function getUsersBalances(pool_id: string) {
  const pool = await PoolModel.findOne({ id: pool_id }).lean();
  invariant(pool, "Pool not found in getUsersBalances");
  const usersBalancesMap: UsersBalancesMap = new Map();
  for (const member of pool.members) {
    usersBalancesMap.set(member._id.toString(), member.balance);
  }
  return usersBalancesMap;
}
