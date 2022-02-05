"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const Transaction_1 = require("./Transaction");
const PoolSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)()
    },
    settledTotal: {
        type: Number,
        default: 0
    },
    unsettledTotal: {
        type: Number,
        default: 0
    },
    members: [mongoose_1.Schema.Types.ObjectId],
    transactions: [Transaction_1.TransactionSchema],
    createdAt: {
        type: Date,
        default: new Date()
    }
});
exports.PoolModel = (0, mongoose_1.model)('Pool', PoolSchema, 'pools');
//# sourceMappingURL=Pool.js.map