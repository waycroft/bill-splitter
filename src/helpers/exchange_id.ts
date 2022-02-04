import { Document, isValidObjectId, Schema } from "mongoose";
import { PoolModel } from "../models/Pool";
import { TransactionModel } from "../models/Transaction";
import { UserModel } from "../models/User";

const allModels = {
    "pools": PoolModel,
    "transactions": TransactionModel,
    "users": UserModel
}
 
const error = 'Could not locate document. Double check that the id passed is valid'

export const getObjId = async function(collectionName: string, id: string): Promise<string> {
    const model = allModels[collectionName];

    let doc: Document
    doc = await model.findOne({ id: id }).lean();

    if (!doc) {
        throw error;
    }
    return doc._id;
}

export const getUUID = async function(collectionName: string, id: Schema.Types.ObjectId): Promise<string> {
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