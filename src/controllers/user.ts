import { upsertDocument } from '../helpers/upsert.js';
import { User, UserModel } from '../models/User.js';

export async function getAllUsers() {
    const users = await UserModel.find().lean();
    return users;
}

export async function upsertUser(userData: User) {
    return await upsertDocument('users', 'email', userData);
}