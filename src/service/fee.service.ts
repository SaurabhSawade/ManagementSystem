import type { Prisma } from "../generated/prisma/client";
import feeModel from "../model/fee.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createFeeRecord = async (
  userId: string,
  amount: number,
  dueDate: Date,
  description?: string,
) => {
  return feeModel.create({
    userId,
    amount,
    dueDate,
    ...(description && { description }),
  });
};

const getFeeById = async (feeId: string) => {
  const fee = await feeModel.findByIdWithUser(feeId);

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
  return feeModel.updateById(feeId, data);
};

const listFees = async (params: {
  page: number;
  limit: number;
  userId?: string | undefined;
  status?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.FeeRecordWhereInput = {};
  if (params.userId) where.userId = params.userId;
  if (params.status) where.status = params.status;
  if (params.dateFrom || params.dateTo) {
    where.dueDate = {};
    if (params.dateFrom) where.dueDate.gte = params.dateFrom;
    if (params.dateTo) where.dueDate.lte = params.dateTo;
  }

  const [fees, total] = await Promise.all([
    feeModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    feeModel.count(where),
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
  const fees = await feeModel.findManyByUserId(userId);

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
