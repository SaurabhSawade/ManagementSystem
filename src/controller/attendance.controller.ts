import { Request, Response } from "express";
import attendanceService from "../service/attendance.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, classRoomId, subjectId, date, status } = req.body;

  const attendance = await attendanceService.markAttendance(
    studentId,
    classRoomId,
    subjectId,
    new Date(date),
    status,
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
    classRoomId,
    subjectId,
    new Date(date),
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

  const attendance = await attendanceService.getAttendanceById(attendanceId);

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

  const attendance = await attendanceService.updateAttendance(attendanceId, {
    status,
    date: date ? new Date(date) : undefined,
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
    studentId: studentId as string,
    classRoomId: classRoomId as string,
    subjectId: subjectId as string,
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
      message: "Attendance records retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const getAttendanceStats = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const stats = await attendanceService.getAttendanceStats(studentId);

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
