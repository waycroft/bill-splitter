"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertDocument = void 0;
const get_model_1 = require("./get_model");
const debug = require('debug')('upsert');
function upsertDocument(incomingData, queryOptions = { collectionName: "", identifier: "_id" }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (queryOptions.collectionName === "") {
            throw 'Must pass a collection name';
        }
        const targetModel = get_model_1.Collections[queryOptions.collectionName].model;
        let existingDocument;
        if (queryOptions.customQuery) {
            existingDocument = yield targetModel.findOne(queryOptions.customQuery);
        }
        else if (typeof queryOptions.identifier === "string") {
            existingDocument = yield targetModel.findOne({ [queryOptions.identifier]: incomingData[queryOptions.identifier] });
        }
        else {
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
        const newDoc = new targetModel(Object.assign({}, incomingData));
        yield newDoc.save();
        return newDoc;
    });
}
exports.upsertDocument = upsertDocument;
//# sourceMappingURL=upsert.js.map