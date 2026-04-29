import { Router } from "express";
import auditController from "../../../../controller/audit.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import auditValidation from "../../../../validation/audit.validation";

const auditRouter = Router();

auditRouter.use(authMiddleware.requireAuth);

auditRouter.get(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.AUDIT_READ),
  validateMiddleware.validate(auditValidation.listAuditLogsSchema),
  auditController.listAuditLogs,
);

auditRouter.get(
  "/:auditId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.AUDIT_READ),
  validateMiddleware.validate(auditValidation.getAuditLogSchema),
  auditController.getAuditLog,
);

export default auditRouter;
