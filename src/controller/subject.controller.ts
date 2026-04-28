import { Request, Response } from "express";
import subjectService from "../service/subject.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name, code } = req.body;

  const subject = await subjectService.createSubject(String(name), String(code));

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Subject created successfully",
      type: "SUCCESS",
      data: subject,
    }),
  );
});

const getSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  const subject = await subjectService.getSubjectById(String(subjectId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Subject retrieved successfully",
      type: "SUCCESS",
      data: subject,
    }),
  );
});

const updateSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const { name, code } = req.body;

  const updateData: {
    name?: string;
    code?: string;
  } = {};

  if (typeof name === "string") updateData.name = name;
  if (typeof code === "string") updateData.code = code;

  const subject = await subjectService.updateSubject(String(subjectId), updateData);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Subject updated successfully",
      type: "SUCCESS",
      data: subject,
    }),
  );
});

const listSubjects = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", search, sortBy = "name", sortOrder = "asc" } = req.query;

  const result = await subjectService.listSubjects({
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
      message: "Subjects retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  await subjectService.deleteSubject(String(subjectId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Subject deleted successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const subjectController = {
  createSubject,
  getSubject,
  updateSubject,
  listSubjects,
  deleteSubject,
};

export default subjectController;
