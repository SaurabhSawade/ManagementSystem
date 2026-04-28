import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import asyncHandler from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import userService from "../service/user.service";

const userController = {
  createUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      roles: req.body.roles,
      studentProfile: req.body.studentProfile,
      teacherProfile: req.body.teacherProfile,
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

  blockUser: asyncHandler(async (req: Request, res: Response) => {
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

  unblockUser: asyncHandler(async (req: Request, res: Response) => {
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

  setUserBlockStatus: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.setUserBlockStatus({
      userId: String(req.params.userId),
      actorId: req.auth!.userId,
      isBlocked: req.body?.isBlocked,
      reason: req.body?.reason,
    });

    return res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: result.isBlocked ? MESSAGES.USER_BLOCKED : MESSAGES.USER_UNBLOCKED,
        type: "SUCCESS",
        data: result.user,
      }),
    );
  }),

  forceResetPassword: asyncHandler(async (req: Request, res: Response) => {
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

  grantAdmin: asyncHandler(async (req: Request, res: Response) => {
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

  revokeAdmin: asyncHandler(async (req: Request, res: Response) => {
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

    setUserRoles: asyncHandler(async (req: Request, res: Response) => {
      const user = await userService.setUserRoles({
        userId: String(req.params.userId),
        roles: req.body.roles,
        actorId: req.auth!.userId,
      });

      return res.status(HTTP_STATUS.OK).json(
        apiResponse.buildResponse({
          status: HTTP_STATUS.OK,
          success: true,
          message: "User roles updated",
          type: "SUCCESS",
          data: user,
        }),
      );
    }),
};

export default userController;
