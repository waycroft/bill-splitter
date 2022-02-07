"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBucketModel = exports.TransactionBucketSchema = exports.TransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TransactionSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        default: new Date()
    },
    owner: mongoose_1.Schema.Types.ObjectId,
    owner_amount: Number,
    amount: Number,
    category: String,
    memo: String,
    payees: [mongoose_1.Schema.Types.Mixed]
});
exports.TransactionBucketSchema = new mongoose_1.Schema({
    pool_id: mongoose_1.Schema.Types.ObjectId,
    start_date: Date,
    end_date: Date,
    transactions: [exports.TransactionSchema],
    transactions_size: Number
});
exports.TransactionBucketModel = (0, mongoose_1.model)('TransactionBucket', exports.TransactionBucketSchema, 'transactions');
//# sourceMappingURL=Transaction.js.map