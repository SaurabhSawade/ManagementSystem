"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMyPassword = exports.verifyOtpAndResetPassword = exports.requestForgotPasswordOtp = exports.refreshAuthTokens = exports.logout = exports.login = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const password_1 = require("../utils/password");
const appError_1 = require("../utils/appError");
const otp_1 = require("../utils/otp");
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../config/logger");
const getUserRoles = async (userId) => {
    const roles = await prisma_1.prisma.userRole.findMany({
        where: { userId },
        include: { role: true },
    });
    return roles.map((r) => r.role.code);
};
const login = async (username, password) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive || user.isBlocked) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid credentials", "AUTH_ERROR");
    }
    const valid = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!valid) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid credentials", "AUTH_ERROR");
    }
    const roles = await getUserRoles(user.id);
    const jti = node_crypto_1.default.randomUUID();
    const payload = {
        userId: user.id,
        username: user.username,
        roles,
        jti,
        ...(user.email ? { email: user.email } : {}),
        ...(user.phone ? { phone: user.phone } : {}),
    };
    return {
        accessToken: (0, jwt_1.signAccessToken)(payload),
        refreshToken: (0, jwt_1.signRefreshToken)(payload),
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            roles,
        },
    };
};
exports.login = login;
const logout = async (accessToken) => {
    const payload = (0, jwt_1.verifyAccessToken)(accessToken);
    const tokenParts = accessToken.split(".");
    const payloadPart = tokenParts[1];
    const decoded = payloadPart
        ? JSON.parse(Buffer.from(payloadPart, "base64").toString())
        : {};
    const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);
    await prisma_1.prisma.tokenBlacklist.upsert({
        where: { jti: payload.jti },
        update: { expiresAt },
        create: {
            jti: payload.jti,
            tokenType: "ACCESS",
            userId: payload.userId,
            expiresAt,
        },
    });
};
exports.logout = logout;
const refreshAuthTokens = async (refreshToken) => {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const blacklisted = await prisma_1.prisma.tokenBlacklist.findUnique({
        where: { jti: payload.jti },
    });
    if (blacklisted) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Refresh token is blacklisted", "AUTH_ERROR");
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive || user.isBlocked) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token", "AUTH_ERROR");
    }
    const roles = await getUserRoles(user.id);
    const newJti = node_crypto_1.default.randomUUID();
    const newPayload = {
        userId: user.id,
        username: user.username,
        roles,
        jti: newJti,
        ...(user.email ? { email: user.email } : {}),
        ...(user.phone ? { phone: user.phone } : {}),
    };
    const refreshParts = refreshToken.split(".");
    const refreshPayload = refreshParts[1];
    const refreshDecoded = refreshPayload
        ? JSON.parse(Buffer.from(refreshPayload, "base64").toString())
        : {};
    const oldExpiry = refreshDecoded.exp
        ? new Date(refreshDecoded.exp * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma_1.prisma.tokenBlacklist.upsert({
        where: { jti: payload.jti },
        update: { expiresAt: oldExpiry },
        create: {
            jti: payload.jti,
            tokenType: "REFRESH",
            expiresAt: oldExpiry,
            userId: payload.userId,
        },
    });
    return {
        accessToken: (0, jwt_1.signAccessToken)(newPayload),
        refreshToken: (0, jwt_1.signRefreshToken)(newPayload),
    };
};
exports.refreshAuthTokens = refreshAuthTokens;
const requestForgotPasswordOtp = async (params) => {
    const orFilters = [];
    if (params.email) {
        orFilters.push({ email: params.email });
    }
    if (params.phone) {
        orFilters.push({ phone: params.phone });
    }
    if (orFilters.length === 0) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Email or phone is required", "VALIDATION_ERROR");
    }
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            OR: orFilters,
        },
    });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const otp = (0, otp_1.generateOtp)();
    const otpHash = (0, otp_1.hashOtp)(otp);
    const expiresAt = new Date(Date.now() + env_1.env.OTP_EXPIRES_MINUTES * 60 * 1000);
    await prisma_1.prisma.otpVerification.create({
        data: {
            userId: user.id,
            email: user.email,
            phone: user.phone,
            channel: params.channel,
            codeHash: otpHash,
            purpose: "FORGOT_PASSWORD",
            expiresAt,
        },
    });
    logger_1.logger.info(`OTP generated for ${user.username} using ${params.channel}: ${otp}`);
    return { masked: params.channel === "EMAIL" ? user.email : user.phone };
};
exports.requestForgotPasswordOtp = requestForgotPasswordOtp;
const verifyOtpAndResetPassword = async (params) => {
    const orFilters = [];
    if (params.email) {
        orFilters.push({ email: params.email });
    }
    if (params.phone) {
        orFilters.push({ phone: params.phone });
    }
    if (orFilters.length === 0) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Email or phone is required", "VALIDATION_ERROR");
    }
    const otpRecord = await prisma_1.prisma.otpVerification.findFirst({
        where: {
            OR: orFilters,
            purpose: "FORGOT_PASSWORD",
            isUsed: false,
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "OTP not found", "VALIDATION_ERROR");
    }
    if (otpRecord.expiresAt < new Date()) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "OTP expired", "VALIDATION_ERROR");
    }
    if (otpRecord.attempts >= env_1.env.OTP_MAX_ATTEMPTS) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.TOO_MANY_REQUESTS, "OTP attempts exceeded", "VALIDATION_ERROR");
    }
    const isValid = otpRecord.codeHash === (0, otp_1.hashOtp)(params.otp);
    await prisma_1.prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
    });
    if (!isValid) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid OTP", "VALIDATION_ERROR");
    }
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                ...(params.email ? [{ email: params.email }] : []),
                ...(params.phone ? [{ phone: params.phone }] : []),
            ],
        },
    });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    await prisma_1.prisma.$transaction([
        prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: await (0, password_1.hashPassword)(params.newPassword),
            },
        }),
        prisma_1.prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: {
                isUsed: true,
                consumedAt: new Date(),
            },
        }),
        prisma_1.prisma.passwordResetRequest.create({
            data: {
                userId: user.id,
                requestedBy: user.id,
                method: "OTP",
                status: "COMPLETED",
            },
        }),
    ]);
};
exports.verifyOtpAndResetPassword = verifyOtpAndResetPassword;
const resetMyPassword = async (params) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    const valid = await (0, password_1.comparePassword)(params.currentPassword, user.passwordHash);
    if (!valid) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Current password is incorrect", "VALIDATION_ERROR");
    }
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await (0, password_1.hashPassword)(params.newPassword) },
    });
};
exports.resetMyPassword = resetMyPassword;
//# sourceMappingURL=auth.service.js.map