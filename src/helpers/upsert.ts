import { Model, Document, HydratedDocument, Query } from 'mongoose';
import { Pool } from "../models/Pool";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { Collections } from './get_model';
const debug = require('debug')('upsert');

interface QueryOptions {
    collectionName: string
    identifier?: string, 
    customQuery?: object
}

/**
 * Upserts a document. 
 * @type The type of object being upserted.
 * @param {T} incomingData The fields to update in the document if updating, or the fields to add if inserting.
 * @param {QueryOptions} queryOptions Options to query for an existing document. Simplest is find by identifier, otherwise a full mongo custom query can be passed.
 * @returns {Promise<Document>} A promise resolving to the upserted document.
 */
export async function upsertDocument<T>(incomingData: T, queryOptions: QueryOptions): Promise<Document> {
        if (!queryOptions.identifier && !queryOptions.customQuery) {
            throw 'No identifier or custom query passed, meaning that theres no means by which to locate an existing document...'
        } else if (!queryOptions.identifier || queryOptions.identifier === "") {
            queryOptions.identifier = "_id";
        }
        const targetModel: Model<T> = Collections[queryOptions.collectionName].model;

        let existingDocument: HydratedDocument<T> | null;
        if (queryOptions.customQuery) {
            existingDocument = await targetModel.findOne(queryOptions.customQuery);
        } else if (typeof queryOptions.identifier === "string") {
            existingDocument = await targetModel.findOne({ [queryOptions.identifier]: incomingData[queryOptions.identifier] });
        } else {
            existingDocument = null;
        }
    
        if (existingDocument != null) {
            debug('document exists');
            
            for (const key of Object.keys(incomingData)) {
                if (key != queryOptions.identifier) {
                    existingDocument[key] = incomingData[key];
                }
            }
            existingDocument.save();
            return existingDocument;
        }
        
        const newDoc: Document<typeof incomingData> = new targetModel({
            ...incomingData
        });
        await newDoc.save();
        return newDoc;
    }