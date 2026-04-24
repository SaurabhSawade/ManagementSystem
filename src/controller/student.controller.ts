import { Request, Response } from "express";
import studentService from "../service/student.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const { userId, rollNumber, classRoomId, guardianName } = req.body;

  const student = await studentService.createStudent(
    userId,
    rollNumber,
    classRoomId,
    guardianName,
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

  const student = await studentService.getStudentById(studentId);

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

  const student = await studentService.updateStudent(studentId, {
    rollNumber,
    classRoomId,
    guardianName,
  });

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
    classRoomId: classRoomId as string,
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  await studentService.deleteStudent(studentId);

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
