import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const resultModel = {
  findByIdWithDetails: (resultId: string) =>
    prisma.result.findUnique({
      where: { id: resultId },
      include: { student: true, classRoom: true, exam: true },
    }),

  findMany: (params: {
    where: Prisma.ResultWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.result.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: { student: true, classRoom: true, exam: true },
    }),

  count: (where: Prisma.ResultWhereInput) => prisma.result.count({ where }),

  findManyByStudentId: (studentId: string) =>
    prisma.result.findMany({
      where: { studentId },
      include: { exam: true, classRoom: true },
      orderBy: { createdAt: "desc" },
    }),

  upsertResult: (data: {
    studentId: string;
    classRoomId: string;
    examId: string;
    totalMarks: number;
    percentage: number;
    grade: string;
  }) =>
    prisma.result.upsert({
      where: { studentId_examId: { studentId: data.studentId, examId: data.examId } },
      update: {
        totalMarks: data.totalMarks,
        percentage: data.percentage,
        grade: data.grade,
        classRoomId: data.classRoomId,
      },
      create: {
        studentId: data.studentId,
        classRoomId: data.classRoomId,
        examId: data.examId,
        totalMarks: data.totalMarks,
        percentage: data.percentage,
        grade: data.grade,
      },
    }),
};

export default resultModel;
