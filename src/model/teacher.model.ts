import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const teacherModel = {
  findByEmployeeId: (employeeId: string) =>
    prisma.teacherProfile.findUnique({
      where: { employeeId },
    }),

  create: (data: { userId: string; employeeId: string; department?: string }) =>
    prisma.teacherProfile.create({
      data: {
        userId: data.userId,
        employeeId: data.employeeId,
        ...(data.department && { department: data.department }),
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  findByIdWithDetails: (teacherId: string) =>
    prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: {
        user: { select: { id: true, username: true, email: true, phone: true } },
      },
    }),

  updateById: (
    teacherId: string,
    data: { employeeId?: string; department?: string | null },
  ) =>
    prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        ...(data.employeeId && { employeeId: data.employeeId }),
        ...(data.department !== undefined && { department: data.department }),
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  findMany: (params: {
    where: Prisma.TeacherProfileWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.teacherProfile.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.sortBy]: params.sortOrder as Prisma.SortOrder,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  count: (where: Prisma.TeacherProfileWhereInput) =>
    prisma.teacherProfile.count({ where }),

  deleteById: (teacherId: string) =>
    prisma.teacherProfile.delete({
      where: { id: teacherId },
    }),
};

export default teacherModel;
