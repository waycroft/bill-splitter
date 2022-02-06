import { Pool, PoolModel } from '../models/Pool.js';
import { LeanUser } from '../models/User.js';
import { getObjId } from '../helpers/exchange_id.js';
import { upsertDocument } from '../helpers/upsert.js';
const debug = require('debug')('pools')

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function upsertPool(poolData: Pool) {
    const query = { members: { $all: poolData.members }};
    return await upsertDocument<Pool>(poolData, {
        collectionName: 'pools',  
        customQuery: query
    });
}

export async function getPoolMemberObjIds(members: Array<LeanUser>): Promise<Array<LeanUser>> {
    for (let i = 0; i < members.length; i++) {
        if (typeof members[i] !== "string") {
            let _id = await getObjId('users', members[i].id);
            members[i]._id = _id;
        }
    }
    return members;
}