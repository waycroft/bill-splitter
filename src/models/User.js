"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: Date,
    lastLoginAt: Date,
    pools: [mongoose.Schema.Types.ObjectId],
    transactions: [mongoose.Schema.Types.ObjectId],
    totalOwed: Number,
    totalOwes: Number,
});
exports.User = (0, mongoose_1.model)('User', UserSchema, 'users');
//# sourceMappingURL=User.js.map