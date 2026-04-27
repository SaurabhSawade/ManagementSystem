import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const subjectModel = {
  findByCode: (code: string) =>
    prisma.subject.findUnique({
      where: { code },
    }),

  create: (name: string, code: string) =>
    prisma.subject.create({
      data: { name, code },
    }),

  findById: (subjectId: string) =>
    prisma.subject.findUnique({
      where: { id: subjectId },
    }),

  updateById: (subjectId: string, data: { name?: string; code?: string }) =>
    prisma.subject.update({
      where: { id: subjectId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code }),
      },
    }),

  findMany: (params: {
    where: Prisma.SubjectWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.subject.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.sortBy]: params.sortOrder as Prisma.SortOrder,
      },
    }),

  count: (where: Prisma.SubjectWhereInput) => prisma.subject.count({ where }),

  deleteById: (subjectId: string) =>
    prisma.subject.delete({
      where: { id: subjectId },
    }),
};

export default subjectModel;
