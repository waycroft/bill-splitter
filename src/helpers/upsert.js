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
const debug = require('debug')('upsert.ts');
function upsertDocument(collectionName, identifier, incomingData, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!identifier && !query) {
            throw 'No identifier or query passed, meaning that theres no means by which to locate an existing document...';
        }
        const targetModel = get_model_1.Collections[collectionName].model;
        let existingDocument;
        if (!query) {
            existingDocument = yield targetModel.findOne({ [identifier]: incomingData[identifier] }).lean();
        }
        else {
            existingDocument = yield targetModel.findOne(query).lean();
        }
        const docAlreadyExists = !!existingDocument;
        if (docAlreadyExists) {
            debug('document exists');
            return existingDocument;
        }
        const newDoc = new targetModel(Object.assign({}, incomingData));
        yield newDoc.save();
        return newDoc;
    });
}
exports.upsertDocument = upsertDocument;
//# sourceMappingURL=upsert.js.map