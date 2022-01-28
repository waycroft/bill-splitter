import { Document } from 'mongoose';
import { Pool, PoolModel } from '../models/Pool.js';
import { User } from '../models/User.js';

export async function getAllPools() {
    let pools = await PoolModel.find().lean();
    return pools;
}

export async function createPool(members: Array<User>) {
    let pool: Document<Pool> = new PoolModel({
        members: members
    });
    await pool.save();
    
    return pool;
}