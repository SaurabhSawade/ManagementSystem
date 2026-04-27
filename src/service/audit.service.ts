import type { Prisma } from "../generated/prisma/client";
import auditModel from "../model/audit.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const getAuditLogById = async (auditId: string) => {
  const log = await auditModel.findByIdWithDetails(auditId);

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

  const where: Prisma.AuditLogWhereInput = {};
  if (params.action) where.action = { contains: params.action, mode: "insensitive" };
  if (params.actorId) where.actorId = params.actorId;
  if (params.targetId) where.targetId = params.targetId;
  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) where.createdAt.gte = params.dateFrom;
    if (params.dateTo) where.createdAt.lte = params.dateTo;
  }

  const [logs, total] = await Promise.all([
    auditModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    auditModel.count(where),
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
  return auditModel.create({
    action,
    ...(actorId && { actorId }),
    ...(targetId && { targetId }),
    ...(meta && { meta }),
  });
};

const auditService = {
  getAuditLogById,
  listAuditLogs,
  createAuditLog,
};

export default auditService;
