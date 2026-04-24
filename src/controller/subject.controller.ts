import { Request, Response } from "express";
import subjectService from "../service/subject.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name, code } = req.body;

  const subject = await subjectService.createSubject(name, code);

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

  const subject = await subjectService.getSubjectById(subjectId);

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

  const subject = await subjectService.updateSubject(subjectId, { name, code });

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
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  await subjectService.deleteSubject(subjectId);

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
