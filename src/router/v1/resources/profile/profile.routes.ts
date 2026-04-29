import { Router } from "express";
import profileController from "../../../../controller/profile.controller";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import { PERMISSIONS } from "../../../../constants/permissions";

const profileRouter = Router();

profileRouter.get(
	"/me",
	authMiddleware.requireAuth,
	rbacMiddleware.requireAnyPermission([
		PERMISSIONS.PROFILE_READ,
		PERMISSIONS.PROFILE_READ_SELF,
	]),
	profileController.getMyProfile,
);

export default profileRouter;
