import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const auditModel = {
  findByIdWithDetails: (auditId: string) =>
    prisma.auditLog.findUnique({
      where: { id: auditId },
      include: {
        actor: { select: { id: true, username: true, email: true } },
        targetUser: { select: { id: true, username: true, email: true } },
      },
    }),

  findMany: (params: {
    where: Prisma.AuditLogWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.auditLog.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: {
        actor: { select: { id: true, username: true, email: true } },
        targetUser: { select: { id: true, username: true, email: true } },
      },
    }),

  count: (where: Prisma.AuditLogWhereInput) => prisma.auditLog.count({ where }),

  create: (data: {
    action: string;
    actorId?: string;
    targetId?: string;
    meta?: Record<string, any>;
  }) =>
    prisma.auditLog.create({
      data: {
        action: data.action,
        ...(data.actorId && { actorId: data.actorId }),
        ...(data.targetId && { targetId: data.targetId }),
        ...(data.meta && { meta: data.meta }),
      },
    }),
};

export default auditModel;
