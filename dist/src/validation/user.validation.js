"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(8).optional(),
        password: zod_1.z.string().min(6),
        roles: zod_1.z.array(zod_1.z.string()).min(1),
    }),
});
const blockUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(3),
    }),
});
const resetUserPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6),
    }),
});
const userValidation = {
    createUserSchema,
    blockUserSchema,
    resetUserPasswordSchema,
};
exports.default = userValidation;
//# sourceMappingURL=user.validation.js.map