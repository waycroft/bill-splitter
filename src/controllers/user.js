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
exports.createUser = exports.getAllUsers = void 0;
const User_js_1 = require("../models/User.js");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield User_js_1.UserModel.find().lean();
        return users;
    });
}
exports.getAllUsers = getAllUsers;
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new User_js_1.UserModel(Object.assign({}, userData));
        yield user.save();
        return user;
    });
}
exports.createUser = createUser;
//# sourceMappingURL=user.js.map