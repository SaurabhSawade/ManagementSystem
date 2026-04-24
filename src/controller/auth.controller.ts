import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import asyncHandler from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import authService from "../service/auth.service";

const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body.username, req.body.password);

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Login successful",
        type: "SUCCESS",
        data: result,
      }),
    );
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);

    if (token) {
      await authService.logout(token);
    }

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Logout successful",
        type: "SUCCESS",
        data: null,
      }),
    );
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.refreshAuthTokens(req.body.refreshToken);

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Token refreshed",
        type: "SUCCESS",
        data: tokens,
      }),
    );
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.requestForgotPasswordOtp({
      email: req.body.email,
      phone: req.body.phone,
      channel: req.body.channel,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.FORGOT_PASSWORD_OTP_SENT,
        type: "SUCCESS",
        data: result,
      }),
    );
  }),

  verifyOtpAndReset: asyncHandler(async (req: Request, res: Response) => {
    await authService.verifyOtpAndResetPassword({
      email: req.body.email,
      phone: req.body.phone,
      otp: req.body.otp,
      newPassword: req.body.newPassword,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
      }),
    );
  }),

  resetMyPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetMyPassword({
      userId: req.auth!.userId,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
      }),
    );
  }),
};

export default authController;
