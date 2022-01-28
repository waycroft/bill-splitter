"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    date: Date,
    owner: mongoose.ObjectId,
    amount: Number,
    category: String,
    memo: String,
    payees: [mongoose.ObjectId]
});
exports.TransactionModel = (0, mongoose_1.model)('Transaction', TransactionSchema, 'transactions');
//# sourceMappingURL=Transaction.js.map