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
exports.searchAllUsers = void 0;
const User_js_1 = require("../models/User.js");
const debug = require('debug')('search');
function searchAllUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield User_js_1.UserModel.aggregate([
            {
                '$search': {
                    'index': 'user_search',
                    'text': {
                        'query': query,
                        'path': {
                            'wildcard': '*'
                        }
                    }
                }
            }
        ]);
        return results;
    });
}
exports.searchAllUsers = searchAllUsers;
//# sourceMappingURL=search.js.map