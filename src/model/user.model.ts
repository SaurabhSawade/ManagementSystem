import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const userModel = {
  findExistingUser: (orFilters: Prisma.UserWhereInput[]) =>
    prisma.user.findFirst({
      where: { OR: orFilters },
    }),

  findUserById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),

  findRolesByCodes: (codes: string[]) =>
    prisma.role.findMany({
      where: { code: { in: codes } },
    }),

  findRoleByCode: (code: string) =>
    prisma.role.findUnique({
      where: { code },
    }),

  createUser: (data: {
    username: string;
    email: string | null;
    phone: string | null;
    passwordHash: string;
    roleIds: string[];
  }) =>
    prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        roles: {
          create: data.roleIds.map((roleId) => ({ roleId })),
        },
      },
    }),

  updateBlockStatus: (params: {
    userId: string;
    isBlocked: boolean;
    blockedReason: string | null;
    blockedAt: Date | null;
  }) =>
    prisma.user.update({
      where: { id: params.userId },
      data: {
        isBlocked: params.isBlocked,
        blockedReason: params.blockedReason,
        blockedAt: params.blockedAt,
      },
    }),

  updatePassword: (userId: string, passwordHash: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),

  createPasswordResetRequest: (data: {
    userId: string;
    requestedBy: string;
    method: string;
    status: string;
  }) =>
    prisma.passwordResetRequest.create({
      data,
    }),

  upsertUserRole: (userId: string, roleId: string) =>
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    }),

  deleteUserRole: (userId: string, roleId: string) =>
    prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    }),

  createAuditLog: (data: {
    actorId: string;
    targetId: string;
    action: string;
    meta?: Prisma.InputJsonValue;
  }) =>
    prisma.auditLog.create({
      data,
    }),
};

export default userModel;
