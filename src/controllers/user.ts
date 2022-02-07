import { User, UserModel } from '../models/User.js';

export async function getAllUsers() {
    const users = await UserModel.find().lean();
    return users;
}

export async function upsertUser(userData: User) {
    if (!userData._id) {
        let existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
            existingUser.email = userData.email;
            existingUser.first_name = userData.first_name;
            existingUser.last_name = userData.last_name;

            return await existingUser.save();
        } else {
            const user = new UserModel({
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name
            })
            return await user.save();
        }
    }

    let user = await UserModel.findOne({ _id: userData._id });
    if (user) {
        user.email = userData.email;
        user.first_name = userData.first_name;
        user.last_name = userData.last_name;
        return await user.save();
    } else {
        throw 'User upsert error'
    }
}