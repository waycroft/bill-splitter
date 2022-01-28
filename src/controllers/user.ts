import { Document } from 'mongoose';
import { User, UserModel } from '../models/User.js';

export async function getAllUsers() {
    const users = await UserModel.find().lean();
    return users;
}

export async function createUser(userData: User) {
    let user: Document<User> = new UserModel({
        ...userData
    });
    await user.save();
    
    return user;
}