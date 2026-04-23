import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  resetMyPasswordController,
  verifyOtpAndResetController,
} from "../controller/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authRateLimit, otpRateLimit } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  forgotPasswordRequestSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyOtpAndResetSchema,
} from "../validation/auth.validation";

const authRouter = Router();

authRouter.post("/login", authRateLimit, validate(loginSchema), loginController);
authRouter.post("/refresh", validate(refreshTokenSchema), refreshController);
authRouter.post(
  "/forgot-password/request-otp",
  otpRateLimit,
  validate(forgotPasswordRequestSchema),
  forgotPasswordController,
);
authRouter.post(
  "/forgot-password/verify-otp",
  otpRateLimit,
  validate(verifyOtpAndResetSchema),
  verifyOtpAndResetController,
);
authRouter.post("/logout", requireAuth, logoutController);
authRouter.post(
  "/reset-password",
  requireAuth,
  validate(resetPasswordSchema),
  resetMyPasswordController,
);

export default authRouter;
