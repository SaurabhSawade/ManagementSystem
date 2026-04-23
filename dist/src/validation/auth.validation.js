"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.verifyOtpAndResetSchema = exports.forgotPasswordRequestSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3),
        password: zod_1.z.string().min(6),
    }),
});
exports.forgotPasswordRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(8).optional(),
        channel: zod_1.z.enum(["EMAIL", "SMS"]),
    })
        .refine((value) => value.email || value.phone, {
        message: "Either email or phone is required",
    }),
});
exports.verifyOtpAndResetSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(8).optional(),
        otp: zod_1.z.string().length(6),
        newPassword: zod_1.z.string().min(6),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(6),
        newPassword: zod_1.z.string().min(6),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(20),
    }),
});
//# sourceMappingURL=auth.validation.js.map