import { Router } from "express";
import feeController from "../../controller/fee.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import feeValidation from "../../validation/fee.validation";

const feeRouter = Router();

feeRouter.use(authMiddleware.requireAuth);

feeRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTANT]),
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_CREATE),
  validateMiddleware.validate(feeValidation.createFeeSchema),
  feeController.createFee,
);

feeRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_READ),
  validateMiddleware.validate(feeValidation.listFeesSchema),
  feeController.listFees,
);

feeRouter.get(
  "/:feeId",
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_READ),
  validateMiddleware.validate(feeValidation.getFeeSchema),
  feeController.getFee,
);

feeRouter.patch(
  "/:feeId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTANT]),
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_UPDATE),
  validateMiddleware.validate(feeValidation.updateFeeSchema),
  feeController.updateFee,
);

feeRouter.post(
  "/:feeId/mark-paid",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ACCOUNTANT]),
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_UPDATE),
  validateMiddleware.validate(feeValidation.markFeeAsPaidSchema),
  feeController.markFeeAsPaid,
);

feeRouter.get(
  "/stats/:userId",
  rbacMiddleware.requirePermission(PERMISSIONS.FEE_READ_SELF),
  feeController.getUserFeeStats,
);

export default feeRouter;
