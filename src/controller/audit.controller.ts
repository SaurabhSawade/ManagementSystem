import { Request, Response } from "express";
import auditService from "../service/audit.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const getAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;

  const log = await auditService.getAuditLogById(auditId);

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
    action: action as string,
    actorId: actorId as string,
    targetId: targetId as string,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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
