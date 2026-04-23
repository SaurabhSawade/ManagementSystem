import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { RoleCode } from "../constants/roles";
import { buildResponse } from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { jti: payload.jti },
    });

    if (blacklisted) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(
        buildResponse({
          status: HTTP_STATUS.UNAUTHORIZED,
          success: false,
          message: "Token is blacklisted",
          type: "AUTH_ERROR",
        }),
      );
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isActive || user.isBlocked) {
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

    req.auth = {
      userId: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.role.code as RoleCode),
      jti: payload.jti,
      ...(user.email ? { email: user.email } : {}),
      ...(user.phone ? { phone: user.phone } : {}),
    };

    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(
      buildResponse({
        status: HTTP_STATUS.UNAUTHORIZED,
        success: false,
        message: MESSAGES.UNAUTHORIZED,
        type: "AUTH_ERROR",
      }),
    );
  }
};
