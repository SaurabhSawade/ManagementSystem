"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMyPasswordController = exports.verifyOtpAndResetController = exports.forgotPasswordController = exports.refreshController = exports.logoutController = exports.loginController = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const auth_service_1 = require("../service/auth.service");
exports.loginController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.login)(req.body.username, req.body.password);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Login successful",
        type: "SUCCESS",
        data: result,
    }));
});
exports.logoutController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);
    if (token) {
        await (0, auth_service_1.logout)(token);
    }
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Logout successful",
        type: "SUCCESS",
        data: null,
    }));
});
exports.refreshController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const tokens = await (0, auth_service_1.refreshAuthTokens)(req.body.refreshToken);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Token refreshed",
        type: "SUCCESS",
        data: tokens,
    }));
});
exports.forgotPasswordController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.requestForgotPasswordOtp)({
        email: req.body.email,
        phone: req.body.phone,
        channel: req.body.channel,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.FORGOT_PASSWORD_OTP_SENT,
        type: "SUCCESS",
        data: result,
    }));
});
exports.verifyOtpAndResetController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, auth_service_1.verifyOtpAndResetPassword)({
        email: req.body.email,
        phone: req.body.phone,
        otp: req.body.otp,
        newPassword: req.body.newPassword,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
    }));
});
exports.resetMyPasswordController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, auth_service_1.resetMyPassword)({
        userId: req.auth.userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
    }));
});
//# sourceMappingURL=auth.controller.js.map