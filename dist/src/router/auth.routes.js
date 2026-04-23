"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validation_1 = require("../validation/auth.validation");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", rateLimit_middleware_1.authRateLimit, (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.loginController);
authRouter.post("/refresh", (0, validate_middleware_1.validate)(auth_validation_1.refreshTokenSchema), auth_controller_1.refreshController);
authRouter.post("/forgot-password/request-otp", rateLimit_middleware_1.otpRateLimit, (0, validate_middleware_1.validate)(auth_validation_1.forgotPasswordRequestSchema), auth_controller_1.forgotPasswordController);
authRouter.post("/forgot-password/verify-otp", rateLimit_middleware_1.otpRateLimit, (0, validate_middleware_1.validate)(auth_validation_1.verifyOtpAndResetSchema), auth_controller_1.verifyOtpAndResetController);
authRouter.post("/logout", auth_middleware_1.requireAuth, auth_controller_1.logoutController);
authRouter.post("/reset-password", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(auth_validation_1.resetPasswordSchema), auth_controller_1.resetMyPasswordController);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map