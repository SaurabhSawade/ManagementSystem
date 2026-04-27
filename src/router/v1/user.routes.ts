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
  "/:userId/block-status",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requireAnyPermission([PERMISSIONS.USER_BLOCK, PERMISSIONS.USER_UNBLOCK]),
  validateMiddleware.validate(userValidation.toggleUserBlockSchema),
  userController.setUserBlockStatus,
);

userRouter.patch(
  "/:userId/block",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_BLOCK),
  validateMiddleware.validate(userValidation.blockUserSchema),
  userController.blockUser,
);

userRouter.patch(
  "/:userId/unblock",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_UNBLOCK),
  validateMiddleware.validate(userValidation.toggleUserBlockSchema),
  userController.unblockUser,
);

userRouter.patch(
  "/:userId/reset-password",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.USER_RESET_PASSWORD),
  validateMiddleware.validate(userValidation.resetUserPasswordSchema),
  userController.forceResetPassword,
);

userRouter.patch(
  "/:userId/grant-admin",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.ADMIN_GRANT),
  userController.grantAdmin,
);

userRouter.patch(
  "/:userId/revoke-admin",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.ADMIN_REVOKE),
  userController.revokeAdmin,
);

export default userRouter;
