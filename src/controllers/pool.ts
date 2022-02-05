import { Document } from 'mongoose';
import { Pool, PoolModel } from '../models/Pool.js';
import { getObjId } from '../helpers/exchange_id.js';
import { v4 as uuidv4 } from 'uuid';
const debug = require('debug')('pools')

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function upsertPool(poolData: Pool) {
    const existingPool = await PoolModel.findOne({ members: { $all: poolData.members }}).lean();
    const poolAlreadyExists = !!existingPool;

    if (poolAlreadyExists) {
        debug('pool exists')
        return existingPool;
    }
    
    const pool: Document<Pool> = new PoolModel({
        id: uuidv4(),
        members: poolData.members
    });
    await pool.save();
    return pool;
}

export async function getPoolMemberObjIds(members: Array<string>) {
    for (let i = 0; i < members.length; i++) {
        let _id = await getObjId('users', members[i]);
        members[i] = _id;
    }
}