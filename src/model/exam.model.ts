import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const examModel = {
  create: (name: string, term: string, examDate: Date) =>
    prisma.exam.create({
      data: { name, term, examDate },
    }),

  findById: (examId: string) =>
    prisma.exam.findUnique({
      where: { id: examId },
    }),

  updateById: (
    examId: string,
    data: {
      name?: string;
      term?: string;
      examDate?: Date;
    },
  ) =>
    prisma.exam.update({
      where: { id: examId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.term && { term: data.term }),
        ...(data.examDate && { examDate: data.examDate }),
      },
    }),

  findMany: (params: {
    where: Prisma.ExamWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.exam.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
    }),

  count: (where: Prisma.ExamWhereInput) => prisma.exam.count({ where }),

  deleteById: (examId: string) =>
    prisma.exam.delete({
      where: { id: examId },
    }),
};

export default examModel;
