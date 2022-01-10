import { Schema, model } from 'mongoose';

interface User {
    name: string;
}

const UserSchema = new Schema<User>({
    name: String
})

export const User = model<User>('User', UserSchema, 'users');