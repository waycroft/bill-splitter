"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const mongoose_1 = require("mongoose");
const Transaction_1 = require("./Transaction");
const PoolSchema = new mongoose_1.Schema({
    settledTotal: Number,
    unsettledTotal: Number,
    members: [mongoose.Schema.Types.ObjectId],
    transactions: [Transaction_1.TransactionModel],
    createdAt: Date
});
exports.Pool = (0, mongoose_1.model)('Pool', PoolSchema, 'pools');
//# sourceMappingURL=Pool.js.map