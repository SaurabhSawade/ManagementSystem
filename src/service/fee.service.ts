import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createFeeRecord = async (
  userId: string,
  amount: number,
  dueDate: Date,
  description?: string,
) => {
  return prisma.feeRecord.create({
    data: {
      userId,
      amount,
      dueDate,
      ...(description && { description }),
      status: "PENDING",
    },
    include: { user: { select: { id: true, username: true, email: true } } },
  });
};

const getFeeById = async (feeId: string) => {
  const fee = await prisma.feeRecord.findUnique({
    where: { id: feeId },
    include: { user: { select: { id: true, username: true, email: true } } },
  });

  if (!fee) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Fee record not found",
      "NOT_FOUND",
    );
  }

  return fee;
};

const updateFeeRecord = async (
  feeId: string,
  data: {
    amount?: number;
    dueDate?: Date;
    status?: string;
    description?: string | null;
  },
) => {
  return prisma.feeRecord.update({
    where: { id: feeId },
    data: {
      ...(data.amount && { amount: data.amount }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.status && { status: data.status }),
      ...(data.description !== undefined && { description: data.description }),
    },
    include: { user: { select: { id: true, username: true, email: true } } },
  });
};

const listFees = async (params: {
  page: number;
  limit: number;
  userId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.userId) where.userId = params.userId;
  if (params.status) where.status = params.status;
  if (params.dateFrom || params.dateTo) {
    where.dueDate = {};
    if (params.dateFrom) where.dueDate.gte = params.dateFrom;
    if (params.dateTo) where.dueDate.lte = params.dateTo;
  }

  const [fees, total] = await Promise.all([
    prisma.feeRecord.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      include: { user: { select: { id: true, username: true, email: true } } },
    }),
    prisma.feeRecord.count({ where }),
  ]);

  return {
    data: fees,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const markFeeAsPaid = async (
  feeId: string,
  paidAmount: number,
  paymentMethod?: string,
) => {
  const fee = await getFeeById(feeId);

  if (paidAmount > fee.amount) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Paid amount cannot exceed fee amount",
      "VALIDATION_ERROR",
    );
  }

  const status = paidAmount === fee.amount ? "PAID" : "PARTIAL";

  return updateFeeRecord(feeId, { status });
};

const getUserFeeStats = async (userId: string) => {
  const fees = await prisma.feeRecord.findMany({
    where: { userId },
  });

  const stats = {
    totalFee: fees.reduce((sum, f) => sum + f.amount, 0),
    pending: fees
      .filter((f) => f.status === "PENDING")
      .reduce((sum, f) => sum + f.amount, 0),
    paid: fees
      .filter((f) => f.status === "PAID")
      .reduce((sum, f) => sum + f.amount, 0),
    partial: fees
      .filter((f) => f.status === "PARTIAL")
      .reduce((sum, f) => sum + f.amount, 0),
    overdue: fees
      .filter((f) => f.status === "OVERDUE")
      .reduce((sum, f) => sum + f.amount, 0),
  };

  return stats;
};

const feeService = {
  createFeeRecord,
  getFeeById,
  updateFeeRecord,
  listFees,
  markFeeAsPaid,
  getUserFeeStats,
};

export default feeService;
