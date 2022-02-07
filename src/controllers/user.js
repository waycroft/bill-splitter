"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUser = exports.getAllUsers = void 0;
const User_js_1 = require("../models/User.js");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield User_js_1.UserModel.find().lean();
        return users;
    });
}
exports.getAllUsers = getAllUsers;
function upsertUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userData._id) {
            let existingUser = yield User_js_1.UserModel.findOne({ email: userData.email });
            if (existingUser) {
                existingUser.email = userData.email;
                existingUser.first_name = userData.first_name;
                existingUser.last_name = userData.last_name;
                return yield existingUser.save();
            }
            else {
                const user = new User_js_1.UserModel({
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name
                });
                return yield user.save();
            }
        }
        let user = yield User_js_1.UserModel.findOne({ _id: userData._id });
        if (user) {
            user.email = userData.email;
            user.first_name = userData.first_name;
            user.last_name = userData.last_name;
            return yield user.save();
        }
        else {
            throw 'User upsert error';
        }
    });
}
exports.upsertUser = upsertUser;
//# sourceMappingURL=user.js.map