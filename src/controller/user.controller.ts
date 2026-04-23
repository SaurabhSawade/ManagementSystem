import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { buildResponse } from "../utils/apiResponse";
import userService from "../service/user.service";

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      roles: req.body.roles,
      actorId: req.auth!.userId,
    });

    res.status(HTTP_STATUS.CREATED).json(
      buildResponse({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: MESSAGES.USER_CREATED,
        type: "SUCCESS",
        data: user,
      }),
    );
  },
);

export const blockUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.blockUser({
      userId: String(req.params.userId),
      reason: req.body.reason,
      actorId: req.auth!.userId,
    });

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.USER_BLOCKED,
        type: "SUCCESS",
        data: user,
      }),
    );
  },
);

export const unblockUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.unblockUser({
      userId: String(req.params.userId),
      actorId: req.auth!.userId,
    });

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.USER_UNBLOCKED,
        type: "SUCCESS",
        data: user,
      }),
    );
  },
);

export const forceResetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    await userService.forceResetPassword({
      userId: String(req.params.userId),
      newPassword: req.body.newPassword,
      actorId: req.auth!.userId,
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

export const grantAdminController = asyncHandler(async (req: Request, res: Response) => {
  await userService.grantAdmin({ userId: String(req.params.userId), actorId: req.auth!.userId });

  res.status(HTTP_STATUS.OK).json(
    buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Admin granted",
      type: "SUCCESS",
      data: null,
    }),
  );
});

export const revokeAdminController = asyncHandler(async (req: Request, res: Response) => {
  await userService.revokeAdmin({ userId: String(req.params.userId), actorId: req.auth!.userId });

  res.status(HTTP_STATUS.OK).json(
    buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Admin revoked",
      type: "SUCCESS",
      data: null,
    }),
  );
});
