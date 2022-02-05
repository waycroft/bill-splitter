import { Document, isValidObjectId, Schema, Model } from "mongoose";
import validate from "uuid-validate";
import { Pool } from "../models/Pool";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { Collections } from '../helpers/get_model.js';
const debug = require('debug')('exchange_id')
 
const error = 'Could not locate document. Double check that the id passed is valid'

export const getObjId = async function(collectionName: string, uuid: string): Promise<string> {
    if (!validate(uuid)) throw 'invalid UUID';

    const model: Model<Pool | Transaction | User> = Collections[collectionName].model;

    let doc: Pool | Transaction | User | null;
    doc = await model.findOne({ id: uuid }).lean();

    if (doc !== null) {
        return doc._id;
    }
    throw error;
}

export const getUUID = async function(collectionName: string, id: Schema.Types.ObjectId): 
    Promise<string> {
    const model = Collections[collectionName].model;

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