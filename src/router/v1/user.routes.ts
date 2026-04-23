import { Router } from "express";
import {
  blockUserController,
  createUserController,
  forceResetPasswordController,
  grantAdminController,
  revokeAdminController,
  unblockUserController,
} from "../../controller/user.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, requireRoles } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  blockUserSchema,
  createUserSchema,
  resetUserPasswordSchema,
} from "../../validation/user.validation";

const userRouter = Router();

userRouter.use(requireAuth);

userRouter.post(
  "/",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.USER_CREATE),
  validate(createUserSchema),
  createUserController,
);

userRouter.patch(
  "/:userId/block",
  requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  requirePermission(PERMISSIONS.USER_BLOCK),
  validate(blockUserSchema),
  blockUserController,
);

userRouter.patch(
  "/:userId/unblock",
  requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  requirePermission(PERMISSIONS.USER_UNBLOCK),
  unblockUserController,
);

userRouter.patch(
  "/:userId/reset-password",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.USER_RESET_PASSWORD),
  validate(resetUserPasswordSchema),
  forceResetPasswordController,
);

userRouter.patch(
  "/:userId/grant-admin",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.ADMIN_GRANT),
  grantAdminController,
);

userRouter.patch(
  "/:userId/revoke-admin",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.ADMIN_REVOKE),
  revokeAdminController,
);

export default userRouter;
