import { Pool, PoolModel } from '../models/Pool.js';
const debug = require('debug')('pools')

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function upsertPool(poolData: Pool) {
    if (!poolData._id) {
        const existingPool = await PoolModel.findOne({ members: { $all: poolData.members }});
        if (!existingPool) {
            const pool = new PoolModel({
                members: poolData.members
            })
            return await pool.save();
        } else {
            existingPool.members = poolData.members;
            return await existingPool.save();
        }
    }

    let pool = await PoolModel.findOne({ _id: poolData._id });
    if (pool != null) {
        pool.members = poolData.members;
        return await pool.save();
    } else {
        throw 'Error with upsertPool'
    }
}