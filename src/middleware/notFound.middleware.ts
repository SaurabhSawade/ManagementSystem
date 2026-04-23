import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { buildResponse } from "../utils/apiResponse";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    buildResponse({
      status: HTTP_STATUS.NOT_FOUND,
      success: false,
      message: "Route not found",
      type: "NOT_FOUND",
    }),
  );
};
