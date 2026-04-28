import type { Prisma } from "../generated/prisma/client";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ROLES } from "../constants/roles";
import userModel from "../model/user.model";
import { AppError } from "../utils/appError";
import passwordUtils from "../utils/password";

const createUser = async (params: {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  roles: string[];
  actorId: string;
  studentProfile?: {
    rollNumber: string;
    classRoomId: string;
    guardianName?: string;
  };
  teacherProfile?: {
    employeeId: string;
    department?: string;
  };
}) => {
  const userFilters: Prisma.UserWhereInput[] = [{ username: params.username }];
  if (params.email) {
    userFilters.push({ email: params.email });
  }
  if (params.phone) {
    userFilters.push({ phone: params.phone });
  }

  const existing = await userModel.findExistingUser(userFilters);

  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, "User already exists", "VALIDATION_ERROR");
  }

  const roleRecords = await userModel.findRolesByCodes(params.roles);

  if (roleRecords.length !== params.roles.length) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid roles in payload", "VALIDATION_ERROR");
  }

  const requiresStudentProfile = params.roles.includes(ROLES.STUDENT);
  const requiresTeacherProfile = params.roles.includes(ROLES.TEACHER);

  if (requiresStudentProfile && !params.studentProfile) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Student profile data is required for STUDENT role", "VALIDATION_ERROR");
  }

  if (requiresTeacherProfile && !params.teacherProfile) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Teacher profile data is required for TEACHER role", "VALIDATION_ERROR");
  }

  const user = await userModel.createUser({
    username: params.username,
    email: params.email ?? null,
    phone: params.phone ?? null,
    passwordHash: await passwordUtils.hashPassword(params.password),
    roleIds: roleRecords.map((role) => role.id),
    ...(params.studentProfile && { studentProfile: params.studentProfile }),
    ...(params.teacherProfile && { teacherProfile: params.teacherProfile }),
  });

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: user.id,
    action: "USER_CREATE",
    meta: { roles: params.roles },
  });

  return user;
};

const setUserBlockStatus = async (params: {
  userId: string;
  actorId: string;
  isBlocked?: boolean;
  reason?: string;
}) => {
  const user = await userModel.findUserById(params.userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  const shouldBlock = typeof params.isBlocked === "boolean" ? params.isBlocked : !user.isBlocked;

  if (shouldBlock) {
    const reason = params.reason?.trim() || user.blockedReason || "Blocked by admin";

    const updated = await userModel.updateBlockStatus({
      userId: params.userId,
      isBlocked: true,
      blockedReason: reason,
      blockedAt: new Date(),
    });

    await userModel.createAuditLog({
      actorId: params.actorId,
      targetId: params.userId,
      action: "USER_BLOCK",
      meta: { reason },
    });

    return { user: updated, isBlocked: true };
  }

  const updated = await userModel.updateBlockStatus({
    userId: params.userId,
    isBlocked: false,
    blockedReason: null,
    blockedAt: null,
  });

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: params.userId,
    action: "USER_UNBLOCK",
  });

  return { user: updated, isBlocked: false };
};

const blockUser = async (params: {
  userId: string;
  reason: string;
  actorId: string;
}) => {
  const result = await setUserBlockStatus({
    userId: params.userId,
    actorId: params.actorId,
    isBlocked: true,
    reason: params.reason,
  });

  return result.user;
};

const unblockUser = async (params: { userId: string; actorId: string }) => {
  const result = await setUserBlockStatus({
    userId: params.userId,
    actorId: params.actorId,
    isBlocked: false,
  });

  return result.user;
};

const forceResetPassword = async (params: {
  userId: string;
  newPassword: string;
  actorId: string;
}) => {
  const user = await userModel.findUserById(params.userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  await userModel.updatePassword(params.userId, await passwordUtils.hashPassword(params.newPassword));

  await userModel.createPasswordResetRequest({
    userId: params.userId,
    requestedBy: params.actorId,
    method: "ADMIN_FORCE",
    status: "COMPLETED",
  });

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: params.userId,
    action: "USER_FORCE_PASSWORD_RESET",
  });
};

const grantAdmin = async (params: { userId: string; actorId: string }) => {
  const adminRole = await userModel.findRoleByCode(ROLES.ADMIN);
  if (!adminRole) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
  }

  await userModel.upsertUserRole(params.userId, adminRole.id);

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: params.userId,
    action: "ADMIN_GRANTED",
  });
};

const revokeAdmin = async (params: { userId: string; actorId: string }) => {
  const adminRole = await userModel.findRoleByCode(ROLES.ADMIN);
  if (!adminRole) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Admin role not configured", "VALIDATION_ERROR");
  }

  await userModel.deleteUserRole(params.userId, adminRole.id);

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: params.userId,
    action: "ADMIN_REVOKED",
  });
};

const setUserRoles = async (params: {
  userId: string;
  roles: string[];
  actorId: string;
}) => {
  const user = await userModel.findUserById(params.userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  const roleRecords = await userModel.findRolesByCodes(params.roles);
  if (roleRecords.length !== params.roles.length) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid roles in payload", "VALIDATION_ERROR");
  }

  const updated = await userModel.replaceUserRoles(
    params.userId,
    roleRecords.map((role) => role.id),
  );

  await userModel.createAuditLog({
    actorId: params.actorId,
    targetId: params.userId,
    action: "USER_ROLES_UPDATED",
    meta: { roles: params.roles },
  });

  return updated;
};

const userService = {
  createUser,
  blockUser,
  unblockUser,
  setUserBlockStatus,
  forceResetPassword,
  grantAdmin,
  revokeAdmin,
  setUserRoles,
};

export default userService;
