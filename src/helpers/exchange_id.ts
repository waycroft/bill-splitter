import { Document, isValidObjectId, Schema, Model } from "mongoose";
import validate from "uuid-validate";
import { Pool, PoolModel } from "../models/Pool";
import { Transaction, TransactionModel } from "../models/Transaction";
import { User, UserModel } from "../models/User";
const debug = require('debug')('exchange_id')

const allModels = {
    "pools": PoolModel,
    "transactions": TransactionModel,
    "users": UserModel
}
 
const error = 'Could not locate document. Double check that the id passed is valid'

export const getObjId = async function(collectionName: string, uuid: string): Promise<string> {
    if (!validate(uuid)) throw 'invalid UUID';

    const model: Model<Pool | Transaction | User> = allModels[collectionName];

    let doc: Pool | Transaction | User | null;
    doc = await model.findOne({ id: uuid }).lean();

    if (doc !== null) {
        return doc._id;
    }
    throw error;
}

export const getUUID = async function(collectionName: string, id: Schema.Types.ObjectId): 
    Promise<string> {
    const model = allModels[collectionName];

    let doc: Document
    if (!isValidObjectId(id)) {
        throw 'Did not pass a valid Object Id';
    }
    doc = await model.findOne({ _id: id }).lean();

    if (!doc) {
        throw error;
    }

    return doc.id;
}