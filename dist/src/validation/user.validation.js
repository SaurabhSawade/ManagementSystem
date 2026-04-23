"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPasswordSchema = exports.blockUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(8).optional(),
        password: zod_1.z.string().min(6),
        roles: zod_1.z.array(zod_1.z.string()).min(1),
    }),
});
exports.blockUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(3),
    }),
});
exports.resetUserPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6),
    }),
});
//# sourceMappingURL=user.validation.js.map