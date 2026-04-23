"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashOtp = exports.generateOtp = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const generateOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};
exports.generateOtp = generateOtp;
const hashOtp = (otp) => {
    return node_crypto_1.default.createHash("sha256").update(otp).digest("hex");
};
exports.hashOtp = hashOtp;
//# sourceMappingURL=otp.js.map