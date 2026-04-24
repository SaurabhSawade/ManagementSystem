import { Router } from "express";
import examController from "../../controller/exam.controller";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import authMiddleware from "../../middleware/auth.middleware";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validateMiddleware from "../../middleware/validate.middleware";
import examValidation from "../../validation/exam.validation";

const examRouter = Router();

examRouter.use(authMiddleware.requireAuth);

examRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.EXAM_CREATE),
  validateMiddleware.validate(examValidation.createExamSchema),
  examController.createExam,
);

examRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.EXAM_LIST),
  validateMiddleware.validate(examValidation.listExamsSchema),
  examController.listExams,
);

examRouter.get(
  "/:examId",
  rbacMiddleware.requirePermission(PERMISSIONS.EXAM_READ),
  validateMiddleware.validate(examValidation.getExamSchema),
  examController.getExam,
);

examRouter.patch(
  "/:examId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.EXAM_UPDATE),
  validateMiddleware.validate(examValidation.updateExamSchema),
  examController.updateExam,
);

examRouter.delete(
  "/:examId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.EXAM_DELETE),
  validateMiddleware.validate(examValidation.deleteExamSchema),
  examController.deleteExam,
);

export default examRouter;
