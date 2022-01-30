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
exports.transformUUIDsIntoObjectIds = exports.getUUID = exports.getObjId = void 0;
const mongoose_1 = require("mongoose");
const Pool_1 = require("../models/Pool");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const uuid_validate_1 = __importDefault(require("uuid-validate"));
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
const transformUUIDsIntoObjectIds = (collectionName, object) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start object', object);
    if (typeof object === "string" && (0, uuid_validate_1.default)(object)) {
        const model = allModels[collectionName];
        const doc = yield model.findOne({ id: object }).lean();
        return doc._id;
    }
    else if (typeof object === "string") {
        console.log('not valid UUID');
    }
    if (typeof object !== "object" && !Array.isArray(object)) {
        console.log('not object or array');
        return 0;
    }
    else if (typeof object === "object" && !Array.isArray(object)) {
        if (Object.keys(object).length === 0) {
            console.log('Is an object, but has no properties');
            return 0;
        }
        console.log('found a nested object...');
        for (let i = 0; i < Object.keys(object).length; i++) {
            let keys = Object.keys(object);
            let currentKey = keys[i];
            let nextKey = keys[i + 1];
            let currentVal = object[currentKey];
            console.log('property', currentVal);
            let parseCurrentVal = yield (0, exports.transformUUIDsIntoObjectIds)(collectionName, currentVal);
            if ((0, mongoose_1.isValidObjectId)(parseCurrentVal)) {
                object[currentKey] = parseCurrentVal;
            }
            else {
                yield (0, exports.transformUUIDsIntoObjectIds)(collectionName, object[nextKey]);
            }
        }
    }
});
exports.transformUUIDsIntoObjectIds = transformUUIDsIntoObjectIds;
var test = {
    one: 1,
    two: "two",
    three: {
        type: "string",
        value: 3
    },
    four: [1, 2, 3],
    five: "f28be967-fc74-48c6-a112-bb9d87ab0dc7"
};
(0, exports.transformUUIDsIntoObjectIds)("pools", test)
    .then(() => {
    console.log(test);
});
//# sourceMappingURL=exchange_id.js.map