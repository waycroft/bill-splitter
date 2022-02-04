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
exports.getUUID = exports.getObjId = void 0;
const mongoose_1 = require("mongoose");
const Pool_1 = require("../models/Pool");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const allModels = {
    "pools": Pool_1.PoolModel,
    "transactions": Transaction_1.TransactionModel,
    "users": User_1.UserModel
};
const error = 'Could not locate document. Double check that the id passed is valid';
const getObjId = function (collectionName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = allModels[collectionName];
        let doc;
        doc = yield model.findOne({ id: id }).lean();
        if (!doc) {
            throw error;
        }
        return doc._id;
    });
};
exports.getObjId = getObjId;
const getUUID = function (collectionName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = allModels[collectionName];
        let doc;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw 'Did not pass a valid Object Id';
        }
        doc = yield model.findOne({ _id: id }).lean();
        if (!doc) {
            throw error;
        }
        return doc.id;
    });
};
exports.getUUID = getUUID;
//# sourceMappingURL=exchange_id.js.map