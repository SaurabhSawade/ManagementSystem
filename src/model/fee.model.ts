import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const feeModel = {
  create: (data: {
    userId: string;
    amount: number;
    dueDate: Date;
    description?: string;
  }) =>
    prisma.feeRecord.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        dueDate: data.dueDate,
        ...(data.description && { description: data.description }),
        status: "PENDING",
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    }),

  findByIdWithUser: (feeId: string) =>
    prisma.feeRecord.findUnique({
      where: { id: feeId },
      include: { user: { select: { id: true, username: true, email: true } } },
    }),

  updateById: (
    feeId: string,
    data: {
      amount?: number;
      dueDate?: Date;
      status?: string;
      description?: string | null;
    },
  ) =>
    prisma.feeRecord.update({
      where: { id: feeId },
      data: {
        ...(data.amount && { amount: data.amount }),
        ...(data.dueDate && { dueDate: data.dueDate }),
        ...(data.status && { status: data.status }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    }),

  findMany: (params: {
    where: Prisma.FeeRecordWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.feeRecord.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: { user: { select: { id: true, username: true, email: true } } },
    }),

  count: (where: Prisma.FeeRecordWhereInput) => prisma.feeRecord.count({ where }),

  findManyByUserId: (userId: string) =>
    prisma.feeRecord.findMany({
      where: { userId },
    }),
};

export default feeModel;
