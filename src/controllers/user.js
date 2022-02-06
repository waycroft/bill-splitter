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
const upsert_js_1 = require("../helpers/upsert.js");
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
        return yield (0, upsert_js_1.upsertDocument)(userData, { collectionName: 'users', identifier: "email" });
    });
}
exports.upsertUser = upsertUser;
//# sourceMappingURL=user.js.map