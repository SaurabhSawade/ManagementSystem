import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const marksModel = {
  upsertMark: (data: {
    studentId: string;
    classRoomId: string;
    subjectId: string;
    examId: string;
    marks: number;
    maxMarks: number;
  }) =>
    prisma.mark.upsert({
      where: {
        studentId_subjectId_examId: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          examId: data.examId,
        },
      },
      update: {
        marks: data.marks,
        maxMarks: data.maxMarks,
        classRoomId: data.classRoomId,
      },
      create: {
        studentId: data.studentId,
        classRoomId: data.classRoomId,
        subjectId: data.subjectId,
        examId: data.examId,
        marks: data.marks,
        maxMarks: data.maxMarks,
      },
    }),

  findByIdWithDetails: (markId: string) =>
    prisma.mark.findUnique({
      where: { id: markId },
      include: { student: true, classRoom: true, subject: true, exam: true },
    }),

  updateById: (markId: string, data: { marks?: number; maxMarks?: number }) =>
    prisma.mark.update({
      where: { id: markId },
      data: {
        ...(data.marks !== undefined && { marks: data.marks }),
        ...(data.maxMarks !== undefined && { maxMarks: data.maxMarks }),
      },
      include: { student: true, classRoom: true, subject: true, exam: true },
    }),

  findMany: (params: {
    where: Prisma.MarkWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.mark.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: { student: true, classRoom: true, subject: true, exam: true },
    }),

  count: (where: Prisma.MarkWhereInput) => prisma.mark.count({ where }),

  findManyByStudentId: (studentId: string) =>
    prisma.mark.findMany({
      where: { studentId },
      include: { subject: true, exam: true },
      orderBy: { createdAt: "desc" },
    }),

  findManyForResultCalculation: (params: {
    studentId: string;
    classRoomId: string;
    examId: string;
  }) =>
    prisma.mark.findMany({
      where: {
        studentId: params.studentId,
        classRoomId: params.classRoomId,
        examId: params.examId,
      },
    }),
};

export default marksModel;
