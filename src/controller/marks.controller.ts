import { Request, Response } from "express";
import marksService from "../service/marks.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ROLES, type RoleCode } from "../constants/roles";
import { AppError } from "../utils/appError";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const hasElevatedMarksAccess = (roles: RoleCode[]) =>
  roles.some(
    (role) =>
      role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.TEACHER,
  );

const createMark = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, classRoomId, subjectId, examId, marks, maxMarks } = req.body;

  const mark = await marksService.createMark(
    String(studentId),
    String(classRoomId),
    String(subjectId),
    String(examId),
    typeof marks === "number" ? marks : Number(marks),
    typeof maxMarks === "number" ? maxMarks : Number(maxMarks),
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Mark created successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const bulkCreateMarks = asyncHandler(async (req: Request, res: Response) => {
  const { examId, subjectId, classRoomId, marks } = req.body;

  const results = await marksService.bulkCreateMarks(
    String(examId),
    String(subjectId),
    String(classRoomId),
    marks,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Marks created for all students",
      type: "SUCCESS",
      data: { count: results.length, records: results },
    }),
  );
});

const getMark = asyncHandler(async (req: Request, res: Response) => {
  const { markId } = req.params;

  const mark = await marksService.getMarkById(String(markId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Mark retrieved successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const updateMark = asyncHandler(async (req: Request, res: Response) => {
  const { markId } = req.params;
  const { marks, maxMarks } = req.body;

  const mark = await marksService.updateMark(String(markId), {
    marks: typeof marks === "number" ? marks : Number(marks),
    maxMarks: typeof maxMarks === "number" ? maxMarks : Number(maxMarks),
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Mark updated successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const listMarks = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", studentId, subjectId, examId, classRoomId, sortBy = "marks", sortOrder = "desc" } = req.query;

  const result = await marksService.listMarks({
    page: Number(page),
    limit: Number(limit),
    studentId: toQueryString(studentId),
    subjectId: toQueryString(subjectId),
    examId: toQueryString(examId),
    classRoomId: toQueryString(classRoomId),
    sortBy: toQueryString(sortBy) ?? "marks",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Marks retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const getStudentMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const requesterId = req.auth?.userId;
  const requesterRoles = req.auth?.roles ?? [];

  if (!requesterId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized", "AUTH_ERROR");
  }

  if (!hasElevatedMarksAccess(requesterRoles) && String(studentId) !== requesterId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, "Forbidden", "FORBIDDEN");
  }

  const marks = await marksService.getStudentMarks(String(studentId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student marks retrieved successfully",
      type: "SUCCESS",
      data: marks,
    }),
  );
});

const marksController = {
  createMark,
  bulkCreateMarks,
  getMark,
  updateMark,
  listMarks,
  getStudentMarks,
};

export default marksController;
