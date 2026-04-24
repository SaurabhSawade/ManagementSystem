import { Router } from "express";
import classroomController from "../../controller/classroom.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import classroomValidation from "../../validation/classroom.validation";

const classroomRouter = Router();

classroomRouter.use(authMiddleware.requireAuth);

classroomRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.CLASSROOM_CREATE),
  validateMiddleware.validate(classroomValidation.createClassroomSchema),
  classroomController.createClassroom,
);

classroomRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.CLASSROOM_LIST),
  validateMiddleware.validate(classroomValidation.listClassroomsSchema),
  classroomController.listClassrooms,
);

classroomRouter.get(
  "/:classroomId",
  rbacMiddleware.requirePermission(PERMISSIONS.CLASSROOM_READ),
  validateMiddleware.validate(classroomValidation.getClassroomSchema),
  classroomController.getClassroom,
);

classroomRouter.patch(
  "/:classroomId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.CLASSROOM_UPDATE),
  validateMiddleware.validate(classroomValidation.updateClassroomSchema),
  classroomController.updateClassroom,
);

classroomRouter.delete(
  "/:classroomId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.CLASSROOM_DELETE),
  validateMiddleware.validate(classroomValidation.getClassroomSchema),
  classroomController.deleteClassroom,
);

export default classroomRouter;
