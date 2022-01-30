import { Document, isValidObjectId, Schema } from "mongoose";
import { PoolModel } from "../models/Pool";
import { TransactionModel } from "../models/Transaction";
import { UserModel } from "../models/User";
import validate from 'uuid-validate';

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

export const transformUUIDsIntoObjectIds = async (collectionName: string, object: any) => {
    console.log('start object', object);
    if (typeof object === "string" && validate(object)) {
        const model = allModels[collectionName];
        const doc = await model.findOne({ id: object }).lean();
        return doc._id;
    } else if (typeof object === "string") {
        console.log('not valid UUID');
    }
    // todo: terminate when all keys have been searched. how to identify...?
    // not an object or an array
    if (typeof object !== "object" && !Array.isArray(object)) {
        console.log('not object or array');
        return 0
    // object, but not array
    } else if (typeof object === "object" && !Array.isArray(object)) {
        // object has no properties... (aka: {})
        if (Object.keys(object).length === 0) {
            console.log('Is an object, but has no properties');
            return 0
        }
        // object has properties. recur from here
        console.log('found a nested object...');
        for (let i = 0; i < Object.keys(object).length; i++) {
            let keys = Object.keys(object);
            let currentKey = keys[i]
            let nextKey = keys[i+1]
            let currentVal = object[currentKey];
            console.log('property', currentVal);

            let parseCurrentVal = await transformUUIDsIntoObjectIds(collectionName, currentVal);
            if (isValidObjectId(parseCurrentVal)) {
                object[currentKey] = parseCurrentVal; 
            } else {
                await transformUUIDsIntoObjectIds(collectionName, object[nextKey]);
            }
        }
    }
}

var test = {
    one: 1,
    two: "two",
    three: {
        type: "string",
        value: 3
    },
    four: [1,2,3],
    five: "f28be967-fc74-48c6-a112-bb9d87ab0dc7"
}

transformUUIDsIntoObjectIds("pools", test)
.then(() => {
    console.log(test);
});