"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const auth_service_1 = __importDefault(require("../service/auth.service"));
const authController = {
    login: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const result = await auth_service_1.default.login(req.body.username, req.body.password);
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: "Login successful",
            type: "SUCCESS",
            data: result,
        }));
    }),
    logout: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.slice(7);
        if (token) {
            await auth_service_1.default.logout(token);
        }
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: "Logout successful",
            type: "SUCCESS",
            data: null,
        }));
    }),
    refresh: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const tokens = await auth_service_1.default.refreshAuthTokens(req.body.refreshToken);
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: "Token refreshed",
            type: "SUCCESS",
            data: tokens,
        }));
    }),
    forgotPassword: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const result = await auth_service_1.default.requestForgotPasswordOtp({
            email: req.body.email,
            phone: req.body.phone,
            channel: req.body.channel,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.FORGOT_PASSWORD_OTP_SENT,
            type: "SUCCESS",
            data: result,
        }));
    }),
    verifyOtpAndReset: asyncHandler_1.default.asyncHandler(async (req, res) => {
        await auth_service_1.default.verifyOtpAndResetPassword({
            email: req.body.email,
            phone: req.body.phone,
            otp: req.body.otp,
            newPassword: req.body.newPassword,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.PASSWORD_RESET,
            type: "SUCCESS",
            data: null,
        }));
    }),
    resetMyPassword: asyncHandler_1.default.asyncHandler(async (req, res) => {
        await auth_service_1.default.resetMyPassword({
            userId: req.auth.userId,
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.PASSWORD_RESET,
            type: "SUCCESS",
            data: null,
        }));
    }),
};
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map