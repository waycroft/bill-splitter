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
function upsertTransaction(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pushToPoolsTransactions(requestBody);
        return yield addTransactionToBucket(requestBody);
    });
}
exports.upsertTransaction = upsertTransaction;
function pushToPoolsTransactions(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield Pool_js_1.PoolModel.findOne({ _id: requestBody.pool_id });
        if (pool && pool.transactions.length >= 25) {
            pool.transactions.shift();
        }
        if (pool) {
            pool.transactions.push(requestBody.transaction);
            yield pool.save();
        }
        else {
            throw 'Couldn\'t find pool';
        }
    });
}
function addTransactionToBucket(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        let existingBucket = yield Transaction_js_1.TransactionBucketModel.findOne({ pool_id: requestBody.pool_id, transactions_size: { $lt: 50 } });
        if (existingBucket) {
            existingBucket.transactions.push(requestBody.transaction);
            existingBucket.transactions_size += 1;
            existingBucket.end_date = requestBody.transaction.date;
            return yield existingBucket.save();
        }
        else {
            let newBucket = new Transaction_js_1.TransactionBucketModel({
                pool_id: requestBody.pool_id,
                start_date: requestBody.transaction.date,
                end_date: requestBody.transaction.date,
                transactions: [requestBody.transaction],
                transactions_size: 1
            });
            return yield newBucket.save();
        }
    });
}
//# sourceMappingURL=transaction.js.map