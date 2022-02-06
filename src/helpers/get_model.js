"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collections = void 0;
const Pool_1 = require("../models/Pool");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
exports.Collections = {
    users: {
        model: User_1.UserModel,
    },
    pools: {
        model: Pool_1.PoolModel,
    },
    transactions: {
        model: Transaction_1.TransactionModel,
    }
};
//# sourceMappingURL=get_model.js.map