import { Router } from "express";
import studentController from "../../controller/student.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import studentValidation from "../../validation/student.validation";

const studentRouter = Router();

studentRouter.use(authMiddleware.requireAuth);

studentRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.STUDENT_CREATE),
  validateMiddleware.validate(studentValidation.createStudentSchema),
  studentController.createStudent,
);

studentRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.STUDENT_LIST),
  validateMiddleware.validate(studentValidation.listStudentsSchema),
  studentController.listStudents,
);

studentRouter.get(
  "/:studentId",
  rbacMiddleware.requirePermission(PERMISSIONS.STUDENT_READ),
  validateMiddleware.validate(studentValidation.getStudentSchema),
  studentController.getStudent,
);

studentRouter.patch(
  "/:studentId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.STUDENT_UPDATE),
  validateMiddleware.validate(studentValidation.updateStudentSchema),
  studentController.updateStudent,
);

studentRouter.delete(
  "/:studentId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.STUDENT_DELETE),
  validateMiddleware.validate(studentValidation.getStudentSchema),
  studentController.deleteStudent,
);

export default studentRouter;
