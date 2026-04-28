import { Request, Response } from "express";
import classroomService from "../service/classroom.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const createClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { name, section } = req.body;

  const classroom = await classroomService.createClassroom(String(name), String(section));

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Classroom created successfully",
      type: "SUCCESS",
      data: classroom,
    }),
  );
});

const getClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { classroomId } = req.params;

  const classroom = await classroomService.getClassroomById(String(classroomId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Classroom retrieved successfully",
      type: "SUCCESS",
      data: classroom,
    }),
  );
});

const updateClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { classroomId } = req.params;
  const { name, section } = req.body;

  const updateData: {
    name?: string;
    section?: string;
  } = {};

  if (typeof name === "string") updateData.name = name;
  if (typeof section === "string") updateData.section = section;

  const classroom = await classroomService.updateClassroom(String(classroomId), updateData);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Classroom updated successfully",
      type: "SUCCESS",
      data: classroom,
    }),
  );
});

const listClassrooms = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", search, sortBy = "name", sortOrder = "asc" } = req.query;

  const result = await classroomService.listClassrooms({
    page: Number(page),
    limit: Number(limit),
    search: toQueryString(search),
    sortBy: toQueryString(sortBy) ?? "name",
    sortOrder: toQueryString(sortOrder) ?? "asc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Classrooms retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const deleteClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { classroomId } = req.params;

  await classroomService.deleteClassroom(String(classroomId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Classroom deleted successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const classroomController = {
  createClassroom,
  getClassroom,
  updateClassroom,
  listClassrooms,
  deleteClassroom,
};

export default classroomController;
