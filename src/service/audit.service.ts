import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const getAuditLogById = async (auditId: string) => {
  const log = await prisma.auditLog.findUnique({
    where: { id: auditId },
    include: {
      actor: { select: { id: true, username: true, email: true } },
      targetUser: { select: { id: true, username: true, email: true } },
    },
  });

  if (!log) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Audit log not found",
      "NOT_FOUND",
    );
  }

  return log;
};

const listAuditLogs = async (params: {
  page: number;
  limit: number;
  action?: string | undefined;
  actorId?: string | undefined;
  targetId?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.action) where.action = { contains: params.action, mode: "insensitive" };
  if (params.actorId) where.actorId = params.actorId;
  if (params.targetId) where.targetId = params.targetId;
  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) where.createdAt.gte = params.dateFrom;
    if (params.dateTo) where.createdAt.lte = params.dateTo;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      include: {
        actor: { select: { id: true, username: true, email: true } },
        targetUser: { select: { id: true, username: true, email: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const createAuditLog = async (
  action: string,
  actorId?: string,
  targetId?: string,
  meta?: Record<string, any>,
) => {
  return prisma.auditLog.create({
    data: {
      action,
      ...(actorId && { actorId }),
      ...(targetId && { targetId }),
      ...(meta && { meta }),
    },
  });
};

const auditService = {
  getAuditLogById,
  listAuditLogs,
  createAuditLog,
};

export default auditService;
