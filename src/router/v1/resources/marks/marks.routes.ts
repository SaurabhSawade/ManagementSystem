import { Router } from "express";
import marksController from "../../../../controller/marks.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import marksValidation from "../../../../validation/marks.validation";

const marksRouter = Router();

marksRouter.use(authMiddleware.requireAuth);

marksRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.MARKS_CREATE),
  validateMiddleware.validate(marksValidation.createMarkSchema),
  marksController.createMark,
);

marksRouter.post(
  "/bulk",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.MARKS_CREATE),
  validateMiddleware.validate(marksValidation.bulkCreateMarksSchema),
  marksController.bulkCreateMarks,
);

marksRouter.get(
  "/",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.MARKS_READ,
    PERMISSIONS.MARKS_READ_SELF,
  ]),
  validateMiddleware.validate(marksValidation.listMarksSchema),
  marksController.listMarks,
);

marksRouter.get(
  "/:markId",
  rbacMiddleware.requirePermission(PERMISSIONS.MARKS_READ),
  validateMiddleware.validate(marksValidation.getMarkSchema),
  marksController.getMark,
);

marksRouter.patch(
  "/:markId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.MARKS_UPDATE),
  validateMiddleware.validate(marksValidation.updateMarkSchema),
  marksController.updateMark,
);

marksRouter.get(
  "/student/:studentId",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.MARKS_READ,
    PERMISSIONS.MARKS_READ_SELF,
  ]),
  marksController.getStudentMarks,
);

export default marksRouter;
