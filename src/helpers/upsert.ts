import { Model, Document } from 'mongoose';
import { Pool } from "../models/Pool";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { Collections } from './get_model';
const debug = require('debug')('upsert.ts');

/**
 * Upserts a document. 
 * @param {string} collectionName The name of the collection which to upsert to.
 * @param {string} identifier The key of the document with which to query.
 * @param {User | Transaction | Pool} incomingData The modified fields to update in the document, usually originating from the request body.
 * @param {object} query An optional custom query in case querying by the identifier won't suffice (such as querying for documents by specific array elements)
 * @returns {Promise<Document>} A promise resolving to the upserted document.
 */
export async function upsertDocument(collectionName: string, identifier: string,
    incomingData: User | Transaction | Pool, query?: object): Promise<Document> {
        if (!identifier && !query) {
            throw 'No identifier or query passed, meaning that theres no means by which to locate an existing document...'
        }
        const targetModel: Model<typeof incomingData> = Collections[collectionName].model;

        let existingDocument: Document<typeof incomingData>;
        if (!query) {
            existingDocument = await targetModel.findOne({ [identifier]: incomingData[identifier] }).lean();
        } else {
            existingDocument = await targetModel.findOne(query).lean();
        }
        const docAlreadyExists = !!existingDocument;
    
        if (docAlreadyExists) {
            debug('document exists')
            return existingDocument;
        }
        
        const newDoc: Document<typeof incomingData> = new targetModel({
            ...incomingData
        });
        await newDoc.save();
        return newDoc;
    }