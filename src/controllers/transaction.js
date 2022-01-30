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
exports.createTransaction = void 0;
const Transaction_js_1 = require("../models/Transaction.js");
const uuid_1 = require("uuid");
const Pool_js_1 = require("../models/Pool.js");
const exchange_id_js_1 = require("../helpers/exchange_id.js");
function createTransaction(pool_id, transactionData) {
    return __awaiter(this, void 0, void 0, function* () {
        let freshId = (0, uuid_1.v4)();
        transactionData.owner = yield (0, exchange_id_js_1.getObjId)("users", transactionData.owner);
        transactionData.payees = yield Promise.all(transactionData.payees.map((uuid) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, exchange_id_js_1.getObjId)("users", uuid);
        })));
        let transaction = new Transaction_js_1.TransactionModel(Object.assign({ id: freshId }, transactionData));
        yield transaction.save();
        let pool = yield Pool_js_1.PoolModel.findOne({ id: pool_id });
        if (pool && pool.transactions) {
            if (pool.transactions.length >= 25) {
                pool.transactions.shift();
            }
            pool.transactions.push(transaction);
            yield pool.save();
        }
        return transaction;
    });
}
exports.createTransaction = createTransaction;
//# sourceMappingURL=transaction.js.map