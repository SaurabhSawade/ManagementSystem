import { Router } from "express";
import attendanceController from "../../../../controller/attendance.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import attendanceValidation from "../../../../validation/attendance.validation";

const attendanceRouter = Router();

attendanceRouter.use(authMiddleware.requireAuth);

attendanceRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.ATTENDANCE_CREATE),
  validateMiddleware.validate(attendanceValidation.createAttendanceSchema),
  attendanceController.markAttendance,
);

attendanceRouter.post(
  "/bulk",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.ATTENDANCE_CREATE),
  validateMiddleware.validate(attendanceValidation.bulkMarkAttendanceSchema),
  attendanceController.bulkMarkAttendance,
);

attendanceRouter.get(
  "/",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.ATTENDANCE_LIST,
    PERMISSIONS.ATTENDANCE_READ_SELF,
  ]),
  validateMiddleware.validate(attendanceValidation.listAttendanceSchema),
  attendanceController.listAttendance,
);

attendanceRouter.get(
  "/:attendanceId",
  rbacMiddleware.requirePermission(PERMISSIONS.ATTENDANCE_READ),
  validateMiddleware.validate(attendanceValidation.getAttendanceSchema),
  attendanceController.getAttendance,
);

attendanceRouter.patch(
  "/:attendanceId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]),
  rbacMiddleware.requirePermission(PERMISSIONS.ATTENDANCE_UPDATE),
  validateMiddleware.validate(attendanceValidation.updateAttendanceSchema),
  attendanceController.updateAttendance,
);

attendanceRouter.get(
  "/stats/:studentId",
  rbacMiddleware.requireAnyPermission([
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_READ_SELF,
  ]),
  attendanceController.getAttendanceStats,
);

export default attendanceRouter;
