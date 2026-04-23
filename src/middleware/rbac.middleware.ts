import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { buildResponse } from "../utils/apiResponse";

export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const roles = req.auth?.roles ?? [];
    const hasRole = roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      res.status(HTTP_STATUS.FORBIDDEN).json(
        buildResponse({
          status: HTTP_STATUS.FORBIDDEN,
          success: false,
          message: MESSAGES.FORBIDDEN,
          type: "FORBIDDEN",
        }),
      );
      return;
    }

    next();
  };
};

export const requirePermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.auth?.userId;

    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(
        buildResponse({
          status: HTTP_STATUS.UNAUTHORIZED,
          success: false,
          message: MESSAGES.UNAUTHORIZED,
          type: "AUTH_ERROR",
        }),
      );
      return;
    }

    const permission = await prisma.userRole.findFirst({
      where: {
        userId,
        role: {
          permissions: {
            some: {
              permission: {
                code: permissionCode,
              },
            },
          },
        },
      },
    });

    if (!permission) {
      res.status(HTTP_STATUS.FORBIDDEN).json(
        buildResponse({
          status: HTTP_STATUS.FORBIDDEN,
          success: false,
          message: MESSAGES.FORBIDDEN,
          type: "FORBIDDEN",
        }),
      );
      return;
    }

    next();
  };
};
