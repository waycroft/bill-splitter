"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolModel = void 0;
const mongoose_1 = require("mongoose");
const Transaction_1 = require("./Transaction");
const PoolSchema = new mongoose_1.Schema({
    settled_total: {
        type: Number,
        default: 0
    },
    unsettled_total: {
        type: Number,
        default: 0
    },
    members: [mongoose_1.Schema.Types.Mixed],
    transactions: [Transaction_1.TransactionSchema],
    created_at: {
        type: Date,
        default: new Date()
    }
});
exports.PoolModel = (0, mongoose_1.model)('Pool', PoolSchema, 'pools');
//# sourceMappingURL=Pool.js.map