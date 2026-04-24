import { Request, Response } from "express";
import resultService from "../service/result.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const getResult = asyncHandler(async (req: Request, res: Response) => {
  const { resultId } = req.params;

  const result = await resultService.getResultById(resultId);

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
    studentId: studentId as string,
    examId: examId as string,
    classRoomId: classRoomId as string,
    gradeFilter: gradeFilter as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  const results = await resultService.getStudentResults(studentId);

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
    studentId,
    classRoomId,
    examId,
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
