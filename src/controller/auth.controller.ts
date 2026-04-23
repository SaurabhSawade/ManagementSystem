import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { buildResponse } from "../utils/apiResponse";
import authService from "../service/auth.service";

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.username, req.body.password);

  res.status(HTTP_STATUS.OK).json(
    buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Login successful",
      type: "SUCCESS",
      data: result,
    }),
  );
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);

  if (token) {
    await authService.logout(token);
  }

  res.status(HTTP_STATUS.OK).json(
    buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Logout successful",
      type: "SUCCESS",
      data: null,
    }),
  );
});

export const refreshController = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuthTokens(req.body.refreshToken);

  res.status(HTTP_STATUS.OK).json(
    buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Token refreshed",
      type: "SUCCESS",
      data: tokens,
    }),
  );
});

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.requestForgotPasswordOtp({
      email: req.body.email,
      phone: req.body.phone,
      channel: req.body.channel,
    });

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.FORGOT_PASSWORD_OTP_SENT,
        type: "SUCCESS",
        data: result,
      }),
    );
  },
);

export const verifyOtpAndResetController = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.verifyOtpAndResetPassword({
      email: req.body.email,
      phone: req.body.phone,
      otp: req.body.otp,
      newPassword: req.body.newPassword,
    });

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
      }),
    );
  },
);

export const resetMyPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetMyPassword({
      userId: req.auth!.userId,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PASSWORD_RESET,
        type: "SUCCESS",
        data: null,
      }),
    );
  },
);
