import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const attendanceModel = {
  upsertAttendance: (data: {
    studentId: string;
    classRoomId: string;
    subjectId: string;
    date: Date;
    status: string;
  }) =>
    prisma.attendanceRecord.upsert({
      where: {
        studentId_subjectId_date: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          date: data.date,
        },
      },
      update: { status: data.status, classRoomId: data.classRoomId },
      create: {
        studentId: data.studentId,
        classRoomId: data.classRoomId,
        subjectId: data.subjectId,
        date: data.date,
        status: data.status,
      },
    }),

  findByIdWithDetails: (attendanceId: string) =>
    prisma.attendanceRecord.findUnique({
      where: { id: attendanceId },
      include: {
        student: true,
        classRoom: true,
        subject: true,
      },
    }),

  updateById: (attendanceId: string, data: { status?: string; date?: Date }) =>
    prisma.attendanceRecord.update({
      where: { id: attendanceId },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.date && { date: data.date }),
      },
      include: {
        student: true,
        classRoom: true,
        subject: true,
      },
    }),

  findMany: (params: {
    where: Prisma.AttendanceRecordWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.attendanceRecord.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: { student: true, classRoom: true, subject: true },
    }),

  count: (where: Prisma.AttendanceRecordWhereInput) =>
    prisma.attendanceRecord.count({ where }),

  findManyByStudentId: (studentId: string) =>
    prisma.attendanceRecord.findMany({ where: { studentId } }),
};

export default attendanceModel;
