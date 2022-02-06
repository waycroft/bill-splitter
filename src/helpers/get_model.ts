import { PoolModel } from "../models/Pool";
import { TransactionModel } from "../models/Transaction";
import { UserModel } from "../models/User";

export const Collections = {
    users: {
        model: UserModel, 
    },
    pools: {
        model: PoolModel,
    },
    transactions: {
        model: TransactionModel,
    }
}