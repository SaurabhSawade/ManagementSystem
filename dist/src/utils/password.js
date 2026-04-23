"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const hashPassword = async (plain) => {
    return bcrypt_1.default.hash(plain, SALT_ROUNDS);
};
const comparePassword = async (plain, hash) => {
    return bcrypt_1.default.compare(plain, hash);
};
const passwordUtils = {
    hashPassword,
    comparePassword,
};
exports.default = passwordUtils;
//# sourceMappingURL=password.js.map