"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    OTP_EXPIRES_MINUTES: zod_1.z.coerce.number().default(10),
    OTP_MAX_ATTEMPTS: zod_1.z.coerce.number().default(5),
    SMTP_FROM: zod_1.z.string().default("no-reply@example.com"),
    SMS_SENDER: zod_1.z.string().default("COLLEGE"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map