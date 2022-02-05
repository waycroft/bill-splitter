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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUID = exports.getObjId = void 0;
const mongoose_1 = require("mongoose");
const uuid_validate_1 = __importDefault(require("uuid-validate"));
const Pool_1 = require("../models/Pool");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const debug = require('debug')('exchange_id');
const allModels = {
    "pools": Pool_1.PoolModel,
    "transactions": Transaction_1.TransactionModel,
    "users": User_1.UserModel
};
const error = 'Could not locate document. Double check that the id passed is valid';
const getObjId = function (collectionName, uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, uuid_validate_1.default)(uuid))
            throw 'invalid UUID';
        const model = allModels[collectionName];
        let doc;
        doc = yield model.findOne({ id: uuid }).lean();
        if (doc !== null) {
            return doc._id;
        }
        throw error;
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