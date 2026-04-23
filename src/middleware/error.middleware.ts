import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { AppError } from "../utils/appError";
import { buildResponse } from "../utils/apiResponse";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.status).json(
      buildResponse({
        status: error.status,
        success: false,
        message: error.message,
        type: error.type,
      }),
    );
    return;
  }

  logger.error(error instanceof Error ? error.stack ?? error.message : String(error));

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    buildResponse({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      success: false,
      message: MESSAGES.SERVER_ERROR,
      type: "SERVER_ERROR",
    }),
  );
};
