"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3),
        password: zod_1.z.string().min(6),
    }),
});
const forgotPasswordRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).optional(),
        channel: zod_1.z.enum(["EMAIL", "SMS"]),
    })
        .refine((value) => value.email || value.phone, {
        message: "Either email or phone is required",
    }),
});
const verifyOtpAndResetSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).optional(),
        otp: zod_1.z.string().length(6),
        newPassword: zod_1.z.string().min(6),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(6),
        newPassword: zod_1.z.string().min(6),
    }),
});
const refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(20),
    }),
});
const authValidation = {
    loginSchema,
    forgotPasswordRequestSchema,
    verifyOtpAndResetSchema,
    resetPasswordSchema,
    refreshTokenSchema,
};
exports.default = authValidation;
//# sourceMappingURL=auth.validation.js.map