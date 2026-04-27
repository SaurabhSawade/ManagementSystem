import { Router } from "express";
import userController from "../../controller/user.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import userValidation from "../../validation/user.validation";

const userRouter = Router();

userRouter.use(authMiddleware.requireAuth);

userRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_CREATE),
  validateMiddleware.validate(userValidation.createUserSchema),
  userController.createUser,
);

userRouter.patch(
  "/block-status/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requireAnyPermission([PERMISSIONS.USER_BLOCK, PERMISSIONS.USER_UNBLOCK]),
  validateMiddleware.validate(userValidation.toggleUserBlockSchema),
  userController.setUserBlockStatus,
);

userRouter.patch(
  "/block/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_BLOCK),
  validateMiddleware.validate(userValidation.blockUserSchema),
  userController.blockUser,
);

userRouter.patch(
  "/unblock/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_UNBLOCK),
  validateMiddleware.validate(userValidation.toggleUserBlockSchema),
  userController.unblockUser,
);

userRouter.patch(
  "/reset-password/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_RESET_PASSWORD),
  validateMiddleware.validate(userValidation.resetUserPasswordSchema),
  userController.forceResetPassword,
);

userRouter.patch(
  "/grant-admin/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.ADMIN_GRANT),
  userController.grantAdmin,
);

userRouter.patch(
  "/revoke-admin/:userId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.ADMIN_REVOKE),
  userController.revokeAdmin,
);

export default userRouter;
