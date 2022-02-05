"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)()
    },
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    lastLoginAt: {
        type: Date,
        default: new Date()
    },
    pools: [mongoose_1.Schema.Types.ObjectId],
    transactions: [mongoose_1.Schema.Types.ObjectId],
    totalOwed: Number,
    totalOwes: Number,
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema, 'users');
//# sourceMappingURL=User.js.map