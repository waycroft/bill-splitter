import invariant from "tiny-invariant";
import { UserModel } from "~/models/UserSchema";
import { isValidObjectId, Types } from "mongoose";
import { TransactionInProgress } from "~/models/TransactionSchema";

import type { User, LeanUser } from "~/models/UserSchema";

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
        last_name: incomingUser.last_name,
      });
      return await user.save();
    }
  }

  let user = await UserModel.findOne({ _id: incomingUser._id });
  invariant(
    user,
    `User upsert error: couldn't find existing user with _id ${incomingUser._id}`
  );

  user.email = incomingUser.email;
  user.first_name = incomingUser.first_name;
  user.last_name = incomingUser.last_name;

  return await user.save();
}

export async function searchAllUsers(
  query: string,
  options = {
    lean: false,
  }
): Promise<User[] | Omit<LeanUser, "balance">[]> {
  let results: User[] = await UserModel.aggregate([
    {
      $search: {
        index: "user_search",
        text: {
          query: query,
          path: {
            wildcard: "*",
          },
        },
      },
    },
  ]);
  if (options.lean) {
    return results.map((user: User): Omit<LeanUser, "balance"> => {
      return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    });
  }
  return results;
}

export async function updateTransactionInProgress(
  _id: string | Types.ObjectId,
  fields: TransactionInProgress
) {
  let user = await UserModel.findById(_id);
  invariant(user, "Could not locate user (updateTransactionInProgress)");
  let newTransactionInProgress: TransactionInProgress;
  if (Object.getOwnPropertyNames(fields).length === 0) {
    newTransactionInProgress = {};
  } else {
    newTransactionInProgress = {
      ...user.transaction_in_progress,
      ...fields,
    };
  }
  user.transaction_in_progress = newTransactionInProgress;
  return await user.save();
}
