import { Router } from "express";
import { exportExcelController, importExcelController } from "../../controller/import.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, requireRoles } from "../../middleware/rbac.middleware";
import { upload } from "../../middleware/upload.middleware";

const importRouter = Router();

importRouter.use(requireAuth);

importRouter.post(
  "/import",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.IMPORT_DATA),
  upload.single("file"),
  importExcelController,
);

importRouter.get(
  "/export",
  requireRoles([ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.EXPORT_DATA),
  exportExcelController,
);

export default importRouter;
