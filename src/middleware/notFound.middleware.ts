import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import apiResponse from "../utils/apiResponse";

const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.NOT_FOUND,
      success: false,
      message: "Route not found",
      type: "NOT_FOUND",
    }),
  );
};

const notFoundMiddleware = {
  notFoundHandler,
};

export default notFoundMiddleware;
