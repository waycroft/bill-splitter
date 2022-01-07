"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const mongoose = require('mongoose');
const mongoose_1 = require("mongoose");
exports.TransactionSchema = new mongoose_1.Schema({
    payer: mongoose.ObjectId,
    amount: Number,
    date: Date,
    memo: String,
    payees: [mongoose.ObjectId]
});
//# sourceMappingURL=Transaction.js.map