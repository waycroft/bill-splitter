import { Pool, PoolModel } from '../models/Pool.js';
const debug = require('debug')('pools')

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function upsertPool(requestBody: Pool) {
    if (!requestBody._id) {
        const existingPool = await PoolModel.findOne({ members: { $all: requestBody.members }});
        if (!existingPool) {
            const pool = new PoolModel({
                members: requestBody.members
            })
            return await pool.save();
        } else {
            existingPool.members = requestBody.members;
            return await existingPool.save();
        }
    }

    let pool = await PoolModel.findOne({ _id: requestBody._id });
    if (pool != null) {
        pool.members = requestBody.members;
        return await pool.save();
    } else {
        throw 'Error with upsertPool'
    }
}