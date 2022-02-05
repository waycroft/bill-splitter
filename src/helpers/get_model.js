"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collections = void 0;
const Pool_1 = require("../models/Pool");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
exports.Collections = {
    users: {
        model: User_1.UserModel,
        singularName: "User"
    },
    pools: {
        model: Pool_1.PoolModel,
        singularName: "Pool"
    },
    transactions: {
        model: Transaction_1.TransactionModel,
        singularName: "Transaction"
    }
};
//# sourceMappingURL=get_model.js.map