import { Router } from "express";
import resultController from "../../../../controller/result.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import resultValidation from "../../../../validation/result.validation";

const resultRouter = Router();

resultRouter.use(authMiddleware.requireAuth);

resultRouter.get(
  "/",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.RESULT_READ,
    PERMISSIONS.RESULT_READ_SELF,
  ]),
  validateMiddleware.validate(resultValidation.listResultsSchema),
  resultController.listResults,
);

resultRouter.get(
  "/:resultId",
  rbacMiddleware.requirePermission(PERMISSIONS.RESULT_READ),
  validateMiddleware.validate(resultValidation.getResultSchema),
  resultController.getResult,
);

resultRouter.post(
  "/generate",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  resultController.generateResult,
);

resultRouter.get(
  "/student/:studentId",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.RESULT_READ,
    PERMISSIONS.RESULT_READ_SELF,
  ]),
  resultController.getStudentResults,
);

export default resultRouter;
