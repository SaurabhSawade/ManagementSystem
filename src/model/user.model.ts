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
    studentProfile?: {
      rollNumber: string;
      classRoomId: string;
      guardianName?: string;
    };
    teacherProfile?: {
      employeeId: string;
      department?: string;
    };
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
        ...(data.studentProfile && {
          studentProfile: {
            create: {
              rollNumber: data.studentProfile.rollNumber,
              classRoomId: data.studentProfile.classRoomId,
              ...(data.studentProfile.guardianName && {
                guardianName: data.studentProfile.guardianName,
              }),
            },
          },
        }),
        ...(data.teacherProfile && {
          teacherProfile: {
            create: {
              employeeId: data.teacherProfile.employeeId,
              ...(data.teacherProfile.department && {
                department: data.teacherProfile.department,
              }),
            },
          },
        }),
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        studentProfile: {
          include: {
            classRoom: true,
          },
        },
        teacherProfile: true,
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

  replaceUserRoles: (userId: string, roleIds: string[]) =>
    prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId } });

      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId, roleId })),
          skipDuplicates: true,
        });
      }

      return tx.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
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
