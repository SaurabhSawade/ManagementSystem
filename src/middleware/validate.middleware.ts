import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import apiResponse from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpStatus";

const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({ body: req.body, params: req.params, query: req.query }) as {
        body?: Request["body"];
        params?: Request["params"];
        query?: Request["query"];
      };

      if (parsed.body) {
        req.body = parsed.body;
      }

      if (parsed.params) {
        req.params = parsed.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
          apiResponse.buildResponse({
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: "Validation failed",
            type: "VALIDATION_ERROR",
            data: error.flatten(),
          }),
        );
        return;
      }

      next(error);
    }
  };

const validateMiddleware = {
  validate,
};

export default validateMiddleware;
