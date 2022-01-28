import { PoolModel } from '../models/Pool.js';

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}