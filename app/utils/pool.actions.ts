import { PoolModel } from "~/models/PoolSchema";
import type { LeanUser } from "~/models/UserSchema";

export async function getPools() {
    return await PoolModel.find().lean();
}

export async function getPool(_id: string) {
    return await PoolModel.findOne({ _id: _id }).lean();
}

export async function createPool(members: LeanUser[]) {
    let newPool = new PoolModel({
        members: members
    })
    return await newPool.save();
}