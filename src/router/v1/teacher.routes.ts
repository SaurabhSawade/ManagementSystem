import { Router } from "express";
import teacherController from "../../controller/teacher.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import teacherValidation from "../../validation/teacher.validation";

const teacherRouter = Router();

teacherRouter.use(authMiddleware.requireAuth);

teacherRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.TEACHER_LIST),
  validateMiddleware.validate(teacherValidation.listTeachersSchema),
  teacherController.listTeachers,
);

teacherRouter.get(
  "/:teacherId",
  rbacMiddleware.requirePermission(PERMISSIONS.TEACHER_READ),
  validateMiddleware.validate(teacherValidation.getTeacherSchema),
  teacherController.getTeacher,
);

teacherRouter.patch(
  "/:teacherId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.TEACHER_UPDATE),
  validateMiddleware.validate(teacherValidation.updateTeacherSchema),
  teacherController.updateTeacher,
);

teacherRouter.delete(
  "/:teacherId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.TEACHER_DELETE),
  validateMiddleware.validate(teacherValidation.getTeacherSchema),
  teacherController.deleteTeacher,
);

export default teacherRouter;
