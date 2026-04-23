import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

const asyncUtils = {
  asyncHandler,
};

export default asyncUtils;
