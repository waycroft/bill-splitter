import { Schema, ObjectId, model } from 'mongoose';
export interface User {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string,
    password: string,
    createdAt: Date,
    lastLoginAt: Date,
    pools: Array<ObjectId>,
    transactions: Array<ObjectId>,
    totalOwed: number,
    totalOwes: number
}

export type LeanUser = Pick<User, "_id" | "id" | "firstName" | "lastName">;


const UserSchema = new Schema<User>({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    lastLoginAt: {
        type: Date,
        default: new Date()
    },
    pools: [Schema.Types.ObjectId],
    transactions: [Schema.Types.ObjectId],
    totalOwed: Number,
    totalOwes: Number,
})

export const UserModel = model<User>('User', UserSchema, 'users');