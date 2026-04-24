import { Request, Response } from "express";
import teacherService from "../service/teacher.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { userId, employeeId, department } = req.body;

  const teacher = await teacherService.createTeacher(
    String(userId),
    String(employeeId),
    typeof department === "string" ? department : undefined,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Teacher created successfully",
      type: "SUCCESS",
      data: teacher,
    }),
  );
});

const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  const teacher = await teacherService.getTeacherById(String(teacherId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Teacher retrieved successfully",
      type: "SUCCESS",
      data: teacher,
    }),
  );
});

const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const { employeeId, department } = req.body;

  const teacher = await teacherService.updateTeacher(String(teacherId), {
    employeeId: typeof employeeId === "string" ? employeeId : undefined,
    department: department === undefined ? undefined : String(department),
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Teacher updated successfully",
      type: "SUCCESS",
      data: teacher,
    }),
  );
});

const listTeachers = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", department, search, sortBy = "employeeId", sortOrder = "asc" } = req.query;

  const result = await teacherService.listTeachers({
    page: Number(page),
    limit: Number(limit),
    department: toQueryString(department),
    search: toQueryString(search),
    sortBy: toQueryString(sortBy) ?? "employeeId",
    sortOrder: toQueryString(sortOrder) ?? "asc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Teachers retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const deleteTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  await teacherService.deleteTeacher(String(teacherId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Teacher deleted successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const teacherController = {
  createTeacher,
  getTeacher,
  updateTeacher,
  listTeachers,
  deleteTeacher,
};

export default teacherController;
