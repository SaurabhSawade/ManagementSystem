import { Router } from "express";
import subjectController from "../../../../controller/subject.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import subjectValidation from "../../../../validation/subject.validation";

const subjectRouter = Router();

subjectRouter.use(authMiddleware.requireAuth);

subjectRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.SUBJECT_CREATE),
  validateMiddleware.validate(subjectValidation.createSubjectSchema),
  subjectController.createSubject,
);

subjectRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.SUBJECT_LIST),
  validateMiddleware.validate(subjectValidation.listSubjectsSchema),
  subjectController.listSubjects,
);

subjectRouter.get(
  "/:subjectId",
  rbacMiddleware.requirePermission(PERMISSIONS.SUBJECT_READ),
  validateMiddleware.validate(subjectValidation.getSubjectSchema),
  subjectController.getSubject,
);

subjectRouter.patch(
  "/:subjectId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.SUBJECT_UPDATE),
  validateMiddleware.validate(subjectValidation.updateSubjectSchema),
  subjectController.updateSubject,
);

subjectRouter.delete(
  "/:subjectId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN]),
  rbacMiddleware.requirePermission(PERMISSIONS.SUBJECT_DELETE),
  validateMiddleware.validate(subjectValidation.getSubjectSchema),
  subjectController.deleteSubject,
);

export default subjectRouter;
