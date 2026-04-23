"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAdmin = exports.grantAdmin = exports.forceResetPassword = exports.unblockUser = exports.blockUser = exports.createUser = void 0;
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const roles_1 = require("../constants/roles");
const appError_1 = require("../utils/appError");
const password_1 = require("../utils/password");
const createUser = async (params) => {
    const existing = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { username: params.username },
                params.email ? { email: params.email } : undefined,
                params.phone ? { phone: params.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (existing) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.CONFLICT, "User already exists", "VALIDATION_ERROR");
    }
    const roleRecords = await prisma_1.prisma.role.findMany({
        where: { code: { in: params.roles } },
    });
    if (roleRecords.length !== params.roles.length) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid roles in payload", "VALIDATION_ERROR");
    }
    const user = await prisma_1.prisma.user.create({
        data: {
            username: params.username,
            email: params.email ?? null,
            phone: params.phone ?? null,
            passwordHash: await (0, password_1.hashPassword)(params.password),
            roles: {
                create: roleRecords.map((role) => ({ roleId: role.id })),
            },
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: user.id,
            action: "USER_CREATE",
            meta: { roles: params.roles },
        },
    });
    return user;
};
exports.createUser = createUser;
const blockUser = async (params) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: params.userId },
        data: {
            isBlocked: true,
            blockedReason: params.reason,
            blockedAt: new Date(),
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: params.userId,
            action: "USER_BLOCK",
            meta: { reason: params.reason },
        },
    });
    return updated;
};
exports.blockUser = blockUser;
const unblockUser = async (params) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: params.userId },
        data: {
            isBlocked: false,
            blockedReason: null,
            blockedAt: null,
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: params.userId,
            action: "USER_UNBLOCK",
        },
    });
    return updated;
};
exports.unblockUser = unblockUser;
const forceResetPassword = async (params) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    await prisma_1.prisma.user.update({
        where: { id: params.userId },
        data: {
            passwordHash: await (0, password_1.hashPassword)(params.newPassword),
        },
    });
    await prisma_1.prisma.passwordResetRequest.create({
        data: {
            userId: params.userId,
            requestedBy: params.actorId,
            method: "ADMIN_FORCE",
            status: "COMPLETED",
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: params.userId,
            action: "USER_FORCE_PASSWORD_RESET",
        },
    });
};
exports.forceResetPassword = forceResetPassword;
const grantAdmin = async (params) => {
    const adminRole = await prisma_1.prisma.role.findUnique({ where: { code: roles_1.ROLES.ADMIN } });
    if (!adminRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
    }
    await prisma_1.prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: params.userId,
                roleId: adminRole.id,
            },
        },
        update: {},
        create: {
            userId: params.userId,
            roleId: adminRole.id,
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: params.userId,
            action: "ADMIN_GRANTED",
        },
    });
};
exports.grantAdmin = grantAdmin;
const revokeAdmin = async (params) => {
    const adminRole = await prisma_1.prisma.role.findUnique({ where: { code: roles_1.ROLES.ADMIN } });
    if (!adminRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
    }
    await prisma_1.prisma.userRole.deleteMany({
        where: {
            userId: params.userId,
            roleId: adminRole.id,
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            actorId: params.actorId,
            targetId: params.userId,
            action: "ADMIN_REVOKED",
        },
    });
};
exports.revokeAdmin = revokeAdmin;
//# sourceMappingURL=user.service.js.map