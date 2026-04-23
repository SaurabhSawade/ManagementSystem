import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import asyncUtils from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import userService from "../service/user.service";

const userController = {
  createUser: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      roles: req.body.roles,
      actorId: req.auth!.userId,
    });

    return res.status(HTTP_STATUS.CREATED).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: MESSAGES.USER_CREATED,
        type: "SUCCESS",
        data: user,
      }),
    );
  }),

  blockUser: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.blockUser({
      userId: String(req.params.userId),
      reason: req.body.reason,
      actorId: req.auth!.userId,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.USER_BLOCKED,
        type: "SUCCESS",
        data: user,
      }),
    );
  }),

  unblockUser: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.unblockUser({
      userId: String(req.params.userId),
      actorId: req.auth!.userId,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.USER_UNBLOCKED,
        type: "SUCCESS",
        data: user,
      }),
    );
  }),

  forceResetPassword: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    await userService.forceResetPassword({
      userId: String(req.params.userId),
      newPassword: req.body.newPassword,
      actorId: req.auth!.userId,
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

  grantAdmin: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    await userService.grantAdmin({ userId: String(req.params.userId), actorId: req.auth!.userId });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Admin granted",
        type: "SUCCESS",
        data: null,
      }),
    );
  }),

  revokeAdmin: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    await userService.revokeAdmin({ userId: String(req.params.userId), actorId: req.auth!.userId });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Admin revoked",
        type: "SUCCESS",
        data: null,
      }),
    );
  }),
};

export default userController;
