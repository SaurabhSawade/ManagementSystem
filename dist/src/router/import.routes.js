"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const import_controller_1 = require("../controller/import.controller");
const permissions_1 = require("../constants/permissions");
const roles_1 = require("../constants/roles");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const importRouter = (0, express_1.Router)();
importRouter.use(auth_middleware_1.requireAuth);
importRouter.post("/import", (0, rbac_middleware_1.requireRoles)([roles_1.ROLES.SUPER_ADMIN]), (0, rbac_middleware_1.requirePermission)(permissions_1.PERMISSIONS.IMPORT_DATA), upload_middleware_1.upload.single("file"), import_controller_1.importExcelController);
importRouter.get("/export", (0, rbac_middleware_1.requireRoles)([roles_1.ROLES.SUPER_ADMIN]), (0, rbac_middleware_1.requirePermission)(permissions_1.PERMISSIONS.EXPORT_DATA), import_controller_1.exportExcelController);
exports.default = importRouter;
//# sourceMappingURL=import.routes.js.map