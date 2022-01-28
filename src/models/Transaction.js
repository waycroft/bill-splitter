"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.TransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TransactionSchema = new mongoose_1.Schema({
    date: Date,
    owner: mongoose_1.Schema.Types.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [mongoose_1.Schema.Types.ObjectId]
});
exports.TransactionModel = (0, mongoose_1.model)('Transaction', exports.TransactionSchema, 'transactions');
//# sourceMappingURL=Transaction.js.map