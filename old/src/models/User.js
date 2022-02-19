"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    last_login_at: {
        type: Date,
        default: new Date()
    },
    pools: [mongoose_1.Schema.Types.ObjectId],
    transactions: [mongoose_1.Schema.Types.ObjectId],
    total_owed: Number,
    total_owes: Number,
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema, 'users');
//# sourceMappingURL=User.js.map