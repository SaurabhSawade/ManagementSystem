"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const roles_1 = require("../constants/roles");
const user_model_1 = __importDefault(require("../model/user.model"));
const appError_1 = require("../utils/appError");
const password_1 = __importDefault(require("../utils/password"));
const createUser = async (params) => {
    const userFilters = [{ username: params.username }];
    if (params.email) {
        userFilters.push({ email: params.email });
    }
    if (params.phone) {
        userFilters.push({ phone: params.phone });
    }
    const existing = await user_model_1.default.findExistingUser(userFilters);
    if (existing) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.CONFLICT, "User already exists", "VALIDATION_ERROR");
    }
    const roleRecords = await user_model_1.default.findRolesByCodes(params.roles);
    if (roleRecords.length !== params.roles.length) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid roles in payload", "VALIDATION_ERROR");
    }
    const user = await user_model_1.default.createUser({
        username: params.username,
        email: params.email ?? null,
        phone: params.phone ?? null,
        passwordHash: await password_1.default.hashPassword(params.password),
        roleIds: roleRecords.map((role) => role.id),
    });
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: user.id,
        action: "USER_CREATE",
        meta: { roles: params.roles },
    });
    return user;
};
const blockUser = async (params) => {
    const user = await user_model_1.default.findUserById(params.userId);
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const updated = await user_model_1.default.updateBlockStatus({
        userId: params.userId,
        isBlocked: true,
        blockedReason: params.reason,
        blockedAt: new Date(),
    });
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: params.userId,
        action: "USER_BLOCK",
        meta: { reason: params.reason },
    });
    return updated;
};
const unblockUser = async (params) => {
    const user = await user_model_1.default.findUserById(params.userId);
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const updated = await user_model_1.default.updateBlockStatus({
        userId: params.userId,
        isBlocked: false,
        blockedReason: null,
        blockedAt: null,
    });
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: params.userId,
        action: "USER_UNBLOCK",
    });
    return updated;
};
const forceResetPassword = async (params) => {
    const user = await user_model_1.default.findUserById(params.userId);
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    await user_model_1.default.updatePassword(params.userId, await password_1.default.hashPassword(params.newPassword));
    await user_model_1.default.createPasswordResetRequest({
        userId: params.userId,
        requestedBy: params.actorId,
        method: "ADMIN_FORCE",
        status: "COMPLETED",
    });
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: params.userId,
        action: "USER_FORCE_PASSWORD_RESET",
    });
};
const grantAdmin = async (params) => {
    const adminRole = await user_model_1.default.findRoleByCode(roles_1.ROLES.ADMIN);
    if (!adminRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
    }
    await user_model_1.default.upsertUserRole(params.userId, adminRole.id);
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: params.userId,
        action: "ADMIN_GRANTED",
    });
};
const revokeAdmin = async (params) => {
    const adminRole = await user_model_1.default.findRoleByCode(roles_1.ROLES.ADMIN);
    if (!adminRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
    }
    await user_model_1.default.deleteUserRole(params.userId, adminRole.id);
    await user_model_1.default.createAuditLog({
        actorId: params.actorId,
        targetId: params.userId,
        action: "ADMIN_REVOKED",
    });
};
const userService = {
    createUser,
    blockUser,
    unblockUser,
    forceResetPassword,
    grantAdmin,
    revokeAdmin,
};
exports.default = userService;
//# sourceMappingURL=user.service.js.map