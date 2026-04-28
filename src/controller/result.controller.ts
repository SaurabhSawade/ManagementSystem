import { Request, Response } from "express";
import resultService from "../service/result.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ROLES, type RoleCode } from "../constants/roles";
import { AppError } from "../utils/appError";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const hasElevatedResultAccess = (roles: RoleCode[]) =>
  roles.some(
    (role) =>
      role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.TEACHER,
  );

const getResult = asyncHandler(async (req: Request, res: Response) => {
  const { resultId } = req.params;

  const result = await resultService.getResultById(String(resultId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Result retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const listResults = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", studentId, examId, classRoomId, gradeFilter, sortBy = "percentage", sortOrder = "desc" } = req.query;

  const results = await resultService.listResults({
    page: Number(page),
    limit: Number(limit),
    studentId: toQueryString(studentId),
    examId: toQueryString(examId),
    classRoomId: toQueryString(classRoomId),
    gradeFilter: toQueryString(gradeFilter),
    sortBy: toQueryString(sortBy) ?? "percentage",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Results retrieved successfully",
      type: "SUCCESS",
      data: results,
    }),
  );
});

const getStudentResults = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const requesterId = req.auth?.userId;
  const requesterRoles = req.auth?.roles ?? [];

  if (!requesterId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized", "AUTH_ERROR");
  }

  if (!hasElevatedResultAccess(requesterRoles) && String(studentId) !== requesterId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "Forbidden", "FORBIDDEN");
  }

  const results = await resultService.getStudentResults(String(studentId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student results retrieved successfully",
      type: "SUCCESS",
      data: results,
    }),
  );
});

const generateResult = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, classRoomId, examId } = req.body;

  const result = await resultService.calculateAndCreateResult(
    String(studentId),
    String(classRoomId),
    String(examId),
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Result generated successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const resultController = {
  getResult,
  listResults,
  getStudentResults,
  generateResult,
};

export default resultController;
