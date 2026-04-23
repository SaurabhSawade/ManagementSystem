"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controller/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const profileRouter = (0, express_1.Router)();
profileRouter.get("/me", auth_middleware_1.requireAuth, profile_controller_1.getMyProfileController);
exports.default = profileRouter;
//# sourceMappingURL=profile.routes.js.map