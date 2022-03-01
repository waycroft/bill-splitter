import { UserModel } from "~/models/UserSchema";
import type { LeanUser } from "~/models/UserSchema";
import invariant from 'tiny-invariant';

import { isValidObjectId } from 'mongoose';

import type { User } from '~/models/UserSchema'; 

export async function getUsers() {
    return await UserModel.find().lean();
}

export async function getUser(_id: string) {
    invariant(isValidObjectId(_id), "Attempted to pass invalid mongo object Id");
    return await UserModel.findOne({ _id: _id }).lean();
}

export async function upsertUser(incomingUser: User) {
    if (!incomingUser._id) {
        let existingUser = await UserModel.findOne({ email: incomingUser.email });
        if (existingUser) {
            existingUser.email = incomingUser.email;
            existingUser.first_name = incomingUser.first_name;
            existingUser.last_name = incomingUser.last_name;

            return await existingUser.save();
        } else {
            const user = new UserModel({
                email: incomingUser.email,
                first_name: incomingUser.first_name,
                last_name: incomingUser.last_name
            })
            return await user.save();
        }
    }

    let user = await UserModel.findOne({ _id: incomingUser._id });
    invariant(user, `User upsert error: couldn't find existing user with _id ${incomingUser._id}`)

    user.email = incomingUser.email;
    user.first_name = incomingUser.first_name;
    user.last_name = incomingUser.last_name;

    return await user.save();
}

export async function searchAllUsers(
    query: string,
    options = {
        lean: false
    }
    ): Promise<User[] | LeanUser[]> {
    let results: User[] = await UserModel.aggregate([
        {
          '$search': {
            'index': 'user_search',
            'text': {
              'query': query,
              'path': {
                'wildcard': '*'
              }
            }
          }
        }
      ])
    if (options.lean) {
        return (
            results.map(user => {
                return { 
                    _id: user._id, 
                    first_name: user.first_name, 
                    last_name: user.last_name 
                };
            })
        )
    }
    return results;
}
