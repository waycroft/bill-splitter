import { PoolModel } from "~/models/PoolSchema";
import invariant from "tiny-invariant";
import { isValidObjectId } from "mongoose";
import { PayeeData } from "~/models/TransactionSchema";

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

export async function updateUsersBalances(
  pool_id: string,
  payeeData: PayeeData[],
  owner: string
) {
  const pool = await PoolModel.findOne({ id: pool_id });
  invariant(pool, "Pool not found (updateUsersBalances)");
  const updateMap = new Map<string, number>();
  for (const payee of payeeData) {
    invariant(payee.user_id, "requires user_id on payeeData element");
    if (payee.user_id.toString() === owner) {
      // bookmark - not going negative. probably an issue with equality check above...
      payee.total_amount * -1;
    }
    updateMap.set(payee.user_id.toString(), payee.total_amount)
  }
  for (let i = 0; i < pool.members.length; i++) {
    const _id = pool.members[i]._id.toString();
    const amount = updateMap.get(_id);
    invariant(amount, `No amount value was stored for ${_id.toString()}`);
    pool.members[i].balance += amount;
  }
  return await pool.save();
}
