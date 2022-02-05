import { Document } from 'mongoose';
import { Pool, PoolModel } from '../models/Pool.js';
import { getObjId } from '../helpers/exchange_id.js';
import { v4 as uuidv4 } from 'uuid';
const debug = require('debug')('pools')

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function createPool(members: Array<string>) {
    await getPoolObjIds(members);

    let pool: Document<Pool> = new PoolModel({
        id: uuidv4(),
        members: members
    });
    await pool.save();
    
    return pool;
}

async function getPoolObjIds(members: Array<string>) {
    for (let i = 0; i < members.length; i++) {
        let _id = await getObjId('users', members[i]);
        members[i] = _id;
    }
}
