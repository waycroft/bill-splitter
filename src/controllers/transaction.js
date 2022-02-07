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
const Transaction_js_1 = require("../models/Transaction.js");
const Pool_js_1 = require("../models/Pool.js");
function upsertTransaction(transactionData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updatePoolsTransactions(transactionData);
        yield addTransactionToBucket(transactionData);
    });
}
exports.upsertTransaction = upsertTransaction;
function addTransactionToBucket(transactionData) {
    return __awaiter(this, void 0, void 0, function* () {
        let transactionBucket = yield Transaction_js_1.TransactionBucketModel.findOne({ pool_id: transactionData.pool_id, transactions_size: { $lt: 50 } });
        if (transactionBucket != null) {
            delete transactionData.pool_id;
            transactionBucket.transactions.push(transactionData);
        }
    });
}
function updatePoolsTransactions(transactionData) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield Pool_js_1.PoolModel.findOne({ _id: transactionData.pool_id });
        if (pool && pool.transactions.length >= 25) {
            pool.transactions.shift();
        }
        if (pool) {
            pool.transactions.push(transactionData);
            yield pool.save();
        }
    });
}
//# sourceMappingURL=transaction.js.map