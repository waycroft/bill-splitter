import { User, UserModel } from '../models/User.js';

export async function getAllUsers() {
    const users = await UserModel.find().lean();
    return users;
}

export async function upsertUser(requestBody: User) {
    if (!requestBody._id) {
        let existingUser = await UserModel.findOne({ email: requestBody.email });
        if (existingUser) {
            existingUser.email = requestBody.email;
            existingUser.first_name = requestBody.first_name;
            existingUser.last_name = requestBody.last_name;

            return await existingUser.save();
        } else {
            const user = new UserModel({
                email: requestBody.email,
                first_name: requestBody.first_name,
                last_name: requestBody.last_name
            })
            return await user.save();
        }
    }

    let user = await UserModel.findOne({ _id: requestBody._id });
    if (user) {
        user.email = requestBody.email;
        user.first_name = requestBody.first_name;
        user.last_name = requestBody.last_name;
        return await user.save();
    } else {
        throw 'User upsert error'
    }
}