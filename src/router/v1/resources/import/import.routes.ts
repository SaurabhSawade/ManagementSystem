import { Router } from "express";
import importController from "../../../../controller/import.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import uploadMiddleware from "../../../../middleware/upload.middleware";

const importRouter = Router();

importRouter.use(authMiddleware.requireAuth);

importRouter.post(
  "/import",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.IMPORT_DATA),
  uploadMiddleware.upload.single("file"),
  importController.importExcel,
);

importRouter.get(
  "/export",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.EXPORT_DATA),
  importController.exportExcel,
);

export default importRouter;
