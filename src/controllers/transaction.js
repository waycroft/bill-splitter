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
exports.upsertTransaction = void 0;
const Pool_js_1 = require("../models/Pool.js");
const upsert_js_1 = require("../helpers/upsert.js");
const exchange_id_js_1 = require("../helpers/exchange_id.js");
function upsertTransaction(transactionData) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield Pool_js_1.PoolModel.findOne({ _id: yield (0, exchange_id_js_1.getObjId)('pools', transactionData.poolId) });
        if (pool && pool.transactions.length >= 25) {
            pool.transactions.shift();
        }
        if (pool) {
            pool.transactions.push(transactionData);
            yield pool.save();
        }
        return yield (0, upsert_js_1.upsertDocument)(transactionData, { collectionName: "transactions" });
    });
}
exports.upsertTransaction = upsertTransaction;
//# sourceMappingURL=transaction.js.map