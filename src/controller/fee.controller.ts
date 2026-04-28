import { Request, Response } from "express";
import feeService from "../service/fee.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ROLES, type RoleCode } from "../constants/roles";
import { AppError } from "../utils/appError";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const toQueryDate = (value: unknown) =>
  typeof value === "string" ? new Date(value) : undefined;

const hasElevatedFeeAccess = (roles: RoleCode[]) =>
  roles.some(
    (role) =>
      role === ROLES.SUPER_ADMIN ||
      role === ROLES.ADMIN ||
      role === ROLES.ACCOUNTANT,
  );

const createFee = asyncHandler(async (req: Request, res: Response) => {
  const { userId, amount, dueDate, description } = req.body;

  const fee = await feeService.createFeeRecord(
    String(userId),
    Number(amount),
    new Date(String(dueDate)),
    typeof description === "string" ? description : undefined,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Fee record created successfully",
      type: "SUCCESS",
      data: fee,
    }),
  );
});

const getFee = asyncHandler(async (req: Request, res: Response) => {
  const { feeId } = req.params;
  const requesterId = req.auth?.userId;
  const requesterRoles = req.auth?.roles ?? [];

  const fee = await feeService.getFeeById(String(feeId));

  if (!hasElevatedFeeAccess(requesterRoles) && fee.userId !== requesterId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "Forbidden", "FORBIDDEN");
  }

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Fee record retrieved successfully",
      type: "SUCCESS",
      data: fee,
    }),
  );
});

const updateFee = asyncHandler(async (req: Request, res: Response) => {
  const { feeId } = req.params;
  const { amount, dueDate, status, description } = req.body;

  const updateData: {
    amount?: number;
    dueDate?: Date;
    status?: string;
    description?: string;
  } = {};

  if (amount !== undefined) {
    updateData.amount = typeof amount === "number" ? amount : Number(amount);
  }

  if (dueDate) {
    updateData.dueDate = new Date(String(dueDate));
  }

  if (typeof status === "string") {
    updateData.status = status;
  }

  if (typeof description === "string") {
    updateData.description = description;
  }

  const fee = await feeService.updateFeeRecord(String(feeId), updateData);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Fee record updated successfully",
      type: "SUCCESS",
      data: fee,
    }),
  );
});

const listFees = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", userId, status, dateFrom, dateTo, sortBy = "dueDate", sortOrder = "asc" } = req.query;
  const requesterId = req.auth?.userId;
  const requesterRoles = req.auth?.roles ?? [];

  if (!requesterId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized", "AUTH_ERROR");
  }

  const effectiveUserId = hasElevatedFeeAccess(requesterRoles)
    ? toQueryString(userId)
    : requesterId;

  const result = await feeService.listFees({
    page: Number(page),
    limit: Number(limit),
    userId: effectiveUserId,
    status: toQueryString(status),
    dateFrom: toQueryDate(dateFrom),
    dateTo: toQueryDate(dateTo),
    sortBy: toQueryString(sortBy) ?? "dueDate",
    sortOrder: toQueryString(sortOrder) ?? "asc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Fee records retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const markFeeAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const { feeId } = req.params;
  const { paidAmount, paymentMethod } = req.body;

  await feeService.markFeeAsPaid(String(feeId), typeof paidAmount === "number" ? paidAmount : Number(paidAmount), typeof paymentMethod === "string" ? paymentMethod : undefined);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Fee marked as paid successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const getUserFeeStats = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requesterId = req.auth?.userId;
  const requesterRoles = req.auth?.roles ?? [];

  if (!requesterId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized", "AUTH_ERROR");
  }

  if (!hasElevatedFeeAccess(requesterRoles) && String(userId) !== requesterId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "Forbidden", "FORBIDDEN");
  }

  const stats = await feeService.getUserFeeStats(String(userId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Fee statistics retrieved",
      type: "SUCCESS",
      data: stats,
    }),
  );
});

const feeController = {
  createFee,
  getFee,
  updateFee,
  listFees,
  markFeeAsPaid,
  getUserFeeStats,
};

export default feeController;
