import { Request, Response } from "express";
import studentService from "../service/student.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const { userId, rollNumber, classRoomId, guardianName } = req.body;

  const student = await studentService.createStudent(
    String(userId),
    String(rollNumber),
    String(classRoomId),
    typeof guardianName === "string" ? guardianName : undefined,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Student created successfully",
      type: "SUCCESS",
      data: student,
    }),
  );
});

const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const student = await studentService.getStudentById(String(studentId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student retrieved successfully",
      type: "SUCCESS",
      data: student,
    }),
  );
});

const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { rollNumber, classRoomId, guardianName } = req.body;

  const updateData: {
    rollNumber?: string;
    classRoomId?: string;
    guardianName?: string | null;
  } = {};

  if (typeof rollNumber === "string") updateData.rollNumber = rollNumber;
  if (typeof classRoomId === "string") updateData.classRoomId = classRoomId;
  if (guardianName !== undefined) updateData.guardianName = String(guardianName);

  const student = await studentService.updateStudent(String(studentId), updateData);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student updated successfully",
      type: "SUCCESS",
      data: student,
    }),
  );
});

const listStudents = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", classRoomId, search, sortBy = "rollNumber", sortOrder = "asc" } = req.query;

  const result = await studentService.listStudents({
    page: Number(page),
    limit: Number(limit),
    classRoomId: toQueryString(classRoomId),
    search: toQueryString(search),
    sortBy: toQueryString(sortBy) ?? "rollNumber",
    sortOrder: toQueryString(sortOrder) ?? "asc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Students retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  await studentService.deleteStudent(String(studentId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student deleted successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const studentController = {
  createStudent,
  getStudent,
  updateStudent,
  listStudents,
  deleteStudent,
};

export default studentController;
