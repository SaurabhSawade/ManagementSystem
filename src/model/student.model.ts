import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const studentModel = {
  findByRollNumber: (rollNumber: string) =>
    prisma.studentProfile.findUnique({
      where: { rollNumber },
    }),

  create: (data: {
    userId: string;
    rollNumber: string;
    classRoomId: string;
    guardianName?: string;
  }) =>
    prisma.studentProfile.create({
      data: {
        userId: data.userId,
        rollNumber: data.rollNumber,
        classRoomId: data.classRoomId,
        ...(data.guardianName && { guardianName: data.guardianName }),
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        classRoom: true,
      },
    }),

  findByIdWithDetails: (studentId: string) =>
    prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { id: true, username: true, email: true, phone: true } },
        classRoom: true,
      },
    }),

  updateById: (
    studentId: string,
    data: {
      rollNumber?: string;
      classRoomId?: string;
      guardianName?: string | null;
    },
  ) =>
    prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        ...(data.rollNumber && { rollNumber: data.rollNumber }),
        ...(data.classRoomId && { classRoomId: data.classRoomId }),
        ...(data.guardianName !== undefined && { guardianName: data.guardianName }),
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        classRoom: true,
      },
    }),

  findMany: (params: {
    where: Prisma.StudentProfileWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.studentProfile.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.sortBy]: params.sortOrder as Prisma.SortOrder,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        classRoom: true,
      },
    }),

  count: (where: Prisma.StudentProfileWhereInput) =>
    prisma.studentProfile.count({ where }),

  deleteById: (studentId: string) =>
    prisma.studentProfile.delete({
      where: { id: studentId },
    }),

  findByClassroomId: (classRoomId: string) =>
    prisma.studentProfile.findMany({
      where: { classRoomId },
      include: {
        user: { select: { id: true, username: true, email: true } },
        classRoom: true,
      },
      orderBy: { rollNumber: "asc" },
    }),
};

export default studentModel;
