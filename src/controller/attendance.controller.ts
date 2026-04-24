import { Request, Response } from "express";
import attendanceService from "../service/attendance.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const toQueryDate = (value: unknown) =>
  typeof value === "string" ? new Date(value) : undefined;

const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, classRoomId, subjectId, date, status } = req.body;

  const attendance = await attendanceService.markAttendance(
    String(studentId),
    String(classRoomId),
    String(subjectId),
    new Date(String(date)),
    String(status),
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Attendance marked successfully",
      type: "SUCCESS",
      data: attendance,
    }),
  );
});

const bulkMarkAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { classRoomId, subjectId, date, attendance } = req.body;

  const results = await attendanceService.bulkMarkAttendance(
    String(classRoomId),
    String(subjectId),
    new Date(String(date)),
    attendance,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Attendance marked for all students",
      type: "SUCCESS",
      data: { count: results.length, records: results },
    }),
  );
});

const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;

  const attendance = await attendanceService.getAttendanceById(String(attendanceId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Attendance retrieved successfully",
      type: "SUCCESS",
      data: attendance,
    }),
  );
});

const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;
  const { status, date } = req.body;

  const attendance = await attendanceService.updateAttendance(String(attendanceId), {
    status: typeof status === "string" ? status : undefined,
    date: date ? new Date(String(date)) : undefined,
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Attendance updated successfully",
      type: "SUCCESS",
      data: attendance,
    }),
  );
});

const listAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", studentId, classRoomId, subjectId, status, dateFrom, dateTo, sortBy = "date", sortOrder = "desc" } = req.query;

  const result = await attendanceService.listAttendance({
    page: Number(page),
    limit: Number(limit),
    studentId: toQueryString(studentId),
    classRoomId: toQueryString(classRoomId),
    subjectId: toQueryString(subjectId),
    status: toQueryString(status),
    dateFrom: toQueryDate(dateFrom),
    dateTo: toQueryDate(dateTo),
    sortBy: toQueryString(sortBy) ?? "date",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Attendance records retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const getAttendanceStats = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const stats = await attendanceService.getAttendanceStats(String(studentId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Attendance statistics retrieved",
      type: "SUCCESS",
      data: stats,
    }),
  );
});

const attendanceController = {
  markAttendance,
  bulkMarkAttendance,
  getAttendance,
  updateAttendance,
  listAttendance,
  getAttendanceStats,
};

export default attendanceController;
