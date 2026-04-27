import crypto from "node:crypto";
import type { OtpChannel, Prisma } from "../generated/prisma/client";
import authModel from "../model/auth.model";
import { HTTP_STATUS } from "../constants/httpStatus";
import passwordUtils from "../utils/password";
import { AppError } from "../utils/appError";
import otpUtils from "../utils/otp";
import { env } from "../config/env";
import jwtUtils from "../utils/jwt";
import { logger } from "../config/logger";

const login = async (username: string, password: string) => {
  const user = await authModel.findUserByUsername(username);

  if (!user || !user.isActive || user.isBlocked) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials", "AUTH_ERROR");
  }

  const valid = await passwordUtils.comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials", "AUTH_ERROR");
  }

  const roles = await authModel.getUserRoles(user.id);
  const jti = crypto.randomUUID();

  const payload = {
    userId: user.id,
    username: user.username,
    roles,
    jti,
    ...(user.email ? { email: user.email } : {}),
    ...(user.phone ? { phone: user.phone } : {}),
  };

  return {
    accessToken: jwtUtils.signAccessToken(payload),
    refreshToken: jwtUtils.signRefreshToken(payload),
    // user: {
    //   id: user.id,
    //   username: user.username,
    //   email: user.email,
    //   phone: user.phone,
    //   roles,
    // },
  };
};

const logout = async (accessToken: string) => {
  const payload = jwtUtils.verifyAccessToken(accessToken);
  const tokenParts = accessToken.split(".");
  const payloadPart = tokenParts[1];
  const decoded = payloadPart
    ? (JSON.parse(Buffer.from(payloadPart, "base64").toString()) as { exp?: number })
    : {};

  const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);

  await authModel.upsertTokenBlacklist({
    jti: payload.jti,
    tokenType: "ACCESS",
    userId: payload.userId,
    expiresAt,
  });
};

const refreshAuthTokens = async (refreshToken: string) => {
  const payload = jwtUtils.verifyRefreshToken(refreshToken);

  const blacklisted = await authModel.findTokenBlacklistByJti(payload.jti);

  if (blacklisted) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is blacklisted", "AUTH_ERROR");
  }

  const user = await authModel.findUserById(payload.userId);
  if (!user || !user.isActive || user.isBlocked) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token", "AUTH_ERROR");
  }

  const roles = await authModel.getUserRoles(user.id);
  const newJti = crypto.randomUUID();

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
    ? (JSON.parse(Buffer.from(refreshPayload, "base64").toString()) as { exp?: number })
    : {};
  const oldExpiry = refreshDecoded.exp
    ? new Date(refreshDecoded.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await authModel.upsertTokenBlacklist({
    jti: payload.jti,
    tokenType: "REFRESH",
    expiresAt: oldExpiry,
    userId: payload.userId,
  });

  return {
    accessToken: jwtUtils.signAccessToken(newPayload),
    refreshToken: jwtUtils.signRefreshToken(newPayload),
  };
};

const requestForgotPasswordOtp = async (params: {
  email?: string;
  phone?: string;
  channel: OtpChannel;
}) => {
  const orFilters: Prisma.UserWhereInput[] = [];
  if (params.email) {
    orFilters.push({ email: params.email });
  }
  if (params.phone) {
    orFilters.push({ phone: params.phone });
  }

  if (orFilters.length === 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Email or phone is required", "VALIDATION_ERROR");
  }

  const user = await authModel.findUserByContact(orFilters);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  const otp = otpUtils.generateOtp();
  const otpHash = otpUtils.hashOtp(otp);
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60 * 1000);

  await authModel.createOtpVerification({
    userId: user.id,
    email: user.email,
    phone: user.phone,
    channel: params.channel,
    codeHash: otpHash,
    purpose: "FORGOT_PASSWORD",
    expiresAt,
  });

  logger.info(`OTP generated for ${user.username} using ${params.channel}: ${otp}`);

  return { masked: params.channel === "EMAIL" ? user.email : user.phone };
};

const verifyOtpAndResetPassword = async (params: {
  email?: string;
  phone?: string;
  otp: string;
  newPassword: string;
}) => {
  const orFilters: Prisma.OtpVerificationWhereInput[] = [];
  if (params.email) {
    orFilters.push({ email: params.email });
  }
  if (params.phone) {
    orFilters.push({ phone: params.phone });
  }

  if (orFilters.length === 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Email or phone is required", "VALIDATION_ERROR");
  }

  const otpRecord = await authModel.findLatestOtp(orFilters);

  if (!otpRecord) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "OTP not found", "VALIDATION_ERROR");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "OTP expired", "VALIDATION_ERROR");
  }

  if (otpRecord.attempts >= env.OTP_MAX_ATTEMPTS) {
    throw new AppError(HTTP_STATUS.TOO_MANY_REQUESTS, "OTP attempts exceeded", "VALIDATION_ERROR");
  }

  const isValid = otpRecord.codeHash === otpUtils.hashOtp(params.otp);

  await authModel.incrementOtpAttempts(otpRecord.id, otpRecord.attempts + 1);

  if (!isValid) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP", "VALIDATION_ERROR");
  }

  const user = await authModel.findUserByContact([
    ...(params.email ? [{ email: params.email }] : []),
    ...(params.phone ? [{ phone: params.phone }] : []),
  ]);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  await authModel.resetPasswordWithOtp({
    userId: user.id,
    otpRecordId: otpRecord.id,
    passwordHash: await passwordUtils.hashPassword(params.newPassword),
  });
};

const resetMyPassword = async (params: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const user = await authModel.findUserById(params.userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  const valid = await passwordUtils.comparePassword(params.currentPassword, user.passwordHash);

  if (!valid) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Current password is incorrect",
      "VALIDATION_ERROR",
    );
  }

  await authModel.updateUserPassword(user.id, await passwordUtils.hashPassword(params.newPassword));
};

const authService = {
  login,
  logout,
  refreshAuthTokens,
  requestForgotPasswordOtp,
  verifyOtpAndResetPassword,
  resetMyPassword,
};

export default authService;
