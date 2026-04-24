import { Request, Response } from "express";
import auditService from "../service/audit.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const toQueryDate = (value: unknown) =>
  typeof value === "string" ? new Date(value) : undefined;

const getAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;

  const log = await auditService.getAuditLogById(String(auditId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Audit log retrieved successfully",
      type: "SUCCESS",
      data: log,
    }),
  );
});

const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", action, actorId, targetId, dateFrom, dateTo, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const result = await auditService.listAuditLogs({
    page: Number(page),
    limit: Number(limit),
    action: toQueryString(action),
    actorId: toQueryString(actorId),
    targetId: toQueryString(targetId),
    dateFrom: toQueryDate(dateFrom),
    dateTo: toQueryDate(dateTo),
    sortBy: toQueryString(sortBy) ?? "createdAt",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Audit logs retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const auditController = {
  getAuditLog,
  listAuditLogs,
};

export default auditController;
