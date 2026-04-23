"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const user_service_1 = __importDefault(require("../service/user.service"));
const userController = {
    createUser: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const user = await user_service_1.default.createUser({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            roles: req.body.roles,
            actorId: req.auth.userId,
        });
        res.status(httpStatus_1.HTTP_STATUS.CREATED).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.CREATED,
            success: true,
            message: messages_1.MESSAGES.USER_CREATED,
            type: "SUCCESS",
            data: user,
        }));
    }),
    blockUser: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const user = await user_service_1.default.blockUser({
            userId: String(req.params.userId),
            reason: req.body.reason,
            actorId: req.auth.userId,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.USER_BLOCKED,
            type: "SUCCESS",
            data: user,
        }));
    }),
    unblockUser: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const user = await user_service_1.default.unblockUser({
            userId: String(req.params.userId),
            actorId: req.auth.userId,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.USER_UNBLOCKED,
            type: "SUCCESS",
            data: user,
        }));
    }),
    forceResetPassword: asyncHandler_1.default.asyncHandler(async (req, res) => {
        await user_service_1.default.forceResetPassword({
            userId: String(req.params.userId),
            newPassword: req.body.newPassword,
            actorId: req.auth.userId,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.PASSWORD_RESET,
            type: "SUCCESS",
            data: null,
        }));
    }),
    grantAdmin: asyncHandler_1.default.asyncHandler(async (req, res) => {
        await user_service_1.default.grantAdmin({ userId: String(req.params.userId), actorId: req.auth.userId });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: "Admin granted",
            type: "SUCCESS",
            data: null,
        }));
    }),
    revokeAdmin: asyncHandler_1.default.asyncHandler(async (req, res) => {
        await user_service_1.default.revokeAdmin({ userId: String(req.params.userId), actorId: req.auth.userId });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: "Admin revoked",
            type: "SUCCESS",
            data: null,
        }));
    }),
};
exports.default = userController;
//# sourceMappingURL=user.controller.js.map