import { Pool, PoolModel } from "../models/Pool";
import { Transaction, TransactionModel } from "../models/Transaction";
import { User, UserModel } from "../models/User";

export const Collections = {
    users: {
        model: UserModel,
        singularName: "User"
    },
    pools: {
        model: PoolModel,
        singularName: "Pool"
    },
    transactions: {
        model: TransactionModel,
        singularName: "Transaction"
    }
}