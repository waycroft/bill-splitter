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
exports.upsertPool = exports.getAllPools = void 0;
const Pool_js_1 = require("../models/Pool.js");
const debug = require('debug')('pools');
function getAllPools() {
    return __awaiter(this, void 0, void 0, function* () {
        let pools = yield Pool_js_1.PoolModel.find().lean();
        return pools;
    });
}
exports.getAllPools = getAllPools;
function upsertPool(poolData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!poolData._id) {
            const existingPool = yield Pool_js_1.PoolModel.findOne({ members: { $all: poolData.members } });
            if (!existingPool) {
                const pool = new Pool_js_1.PoolModel({
                    members: poolData.members
                });
                return yield pool.save();
            }
            else {
                existingPool.members = poolData.members;
                return yield existingPool.save();
            }
        }
        let pool = yield Pool_js_1.PoolModel.findOne({ _id: poolData._id });
        if (pool != null) {
            pool.members = poolData.members;
            return yield pool.save();
        }
        else {
            throw 'Error with upsertPool';
        }
    });
}
exports.upsertPool = upsertPool;
//# sourceMappingURL=pool.js.map