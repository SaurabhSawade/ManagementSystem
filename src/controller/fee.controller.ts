import { Request, Response } from "express";
import feeService from "../service/fee.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createFee = asyncHandler(async (req: Request, res: Response) => {
  const { userId, amount, dueDate, description } = req.body;

  const fee = await feeService.createFeeRecord(
    userId,
    amount,
    new Date(dueDate),
    description,
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

  const fee = await feeService.getFeeById(feeId);

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

  const fee = await feeService.updateFeeRecord(feeId, {
    amount,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    status,
    description,
  });

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

  const result = await feeService.listFees({
    page: Number(page),
    limit: Number(limit),
    userId: userId as string,
    status: status as string,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  await feeService.markFeeAsPaid(feeId, paidAmount, paymentMethod);

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

  const stats = await feeService.getUserFeeStats(userId);

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
