"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAdminController = exports.grantAdminController = exports.forceResetPasswordController = exports.unblockUserController = exports.blockUserController = exports.createUserController = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const user_service_1 = require("../service/user.service");
exports.createUserController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, user_service_1.createUser)({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        roles: req.body.roles,
        actorId: req.auth.userId,
    });
    res.status(httpStatus_1.HTTP_STATUS.CREATED).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.CREATED,
        success: true,
        message: messages_1.MESSAGES.USER_CREATED,
        type: "SUCCESS",
        data: user,
    }));
});
exports.blockUserController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, user_service_1.blockUser)({
        userId: String(req.params.userId),
        reason: req.body.reason,
        actorId: req.auth.userId,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.USER_BLOCKED,
        type: "SUCCESS",
        data: user,
    }));
});
exports.unblockUserController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, user_service_1.unblockUser)({
        userId: String(req.params.userId),
        actorId: req.auth.userId,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.USER_UNBLOCKED,
        type: "SUCCESS",
        data: user,
    }));
});
exports.forceResetPasswordController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, user_service_1.forceResetPassword)({
        userId: String(req.params.userId),
        newPassword: req.body.newPassword,
        actorId: req.auth.userId,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
    }));
});
exports.grantAdminController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, user_service_1.grantAdmin)({ userId: String(req.params.userId), actorId: req.auth.userId });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Admin granted",
        type: "SUCCESS",
        data: null,
    }));
});
exports.revokeAdminController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, user_service_1.revokeAdmin)({ userId: String(req.params.userId), actorId: req.auth.userId });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Admin revoked",
        type: "SUCCESS",
        data: null,
    }));
});
//# sourceMappingURL=user.controller.js.map