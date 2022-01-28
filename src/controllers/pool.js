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
function getAllPools() {
    return __awaiter(this, void 0, void 0, function* () {
        let pools = yield Pool_js_1.PoolModel.find().lean();
        return pools;
    });
}
exports.getAllPools = getAllPools;
function createPool(members) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = new Pool_js_1.PoolModel({
            members: members
        });
        yield pool.save();
        return pool;
    });
}
exports.createPool = createPool;
//# sourceMappingURL=pool.js.map