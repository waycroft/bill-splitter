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
exports.createPool = exports.getAllPools = void 0;
const Pool_js_1 = require("../models/Pool.js");
const exchange_id_js_1 = require("../helpers/exchange_id.js");
const uuid_1 = require("uuid");
const debug = require('debug')('pools');
function getAllPools() {
    return __awaiter(this, void 0, void 0, function* () {
        let pools = yield Pool_js_1.PoolModel.find().lean();
        return pools;
    });
}
exports.getAllPools = getAllPools;
function createPool(members) {
    return __awaiter(this, void 0, void 0, function* () {
        yield getPoolObjIds(members);
        let pool = new Pool_js_1.PoolModel({
            id: (0, uuid_1.v4)(),
            members: members
        });
        yield pool.save();
        return pool;
    });
}
exports.createPool = createPool;
function getPoolObjIds(members) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < members.length; i++) {
            let _id = yield (0, exchange_id_js_1.getObjId)('users', members[i]);
            members[i] = _id;
        }
    });
}
//# sourceMappingURL=pool.js.map