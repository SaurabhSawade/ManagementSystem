import { Router } from "express";
import authController from "../../../../controller/auth.controller";
import authMiddleware from "../../../../middleware/auth.middleware";
import rateLimitMiddleware from "../../../../middleware/rateLimit.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import authValidation from "../../../../validation/auth.validation";

const authRouter = Router();

authRouter.post(
  "/login",
  rateLimitMiddleware.authRateLimit,
  validateMiddleware.validate(authValidation.loginSchema),
  authController.login,
);
authRouter.post(
  "/refresh",
  validateMiddleware.validate(authValidation.refreshTokenSchema),
  authController.refresh,
);
authRouter.post(
  "/forgot-password/request-otp",
  rateLimitMiddleware.otpRateLimit,
  validateMiddleware.validate(authValidation.forgotPasswordRequestSchema),
  authController.forgotPassword,
);
authRouter.post(
  "/forgot-password/verify-otp",
  rateLimitMiddleware.otpRateLimit,
  validateMiddleware.validate(authValidation.verifyOtpAndResetSchema),
  authController.verifyOtpAndReset,
);
authRouter.post("/logout", authMiddleware.requireAuth, authController.logout);
authRouter.post(
  "/reset-password",
  authMiddleware.requireAuth,
  validateMiddleware.validate(authValidation.resetPasswordSchema),
  authController.resetMyPassword,
);

export default authRouter;
