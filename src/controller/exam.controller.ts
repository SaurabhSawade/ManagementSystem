import { Request, Response } from "express";
import examService from "../service/exam.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const toQueryDate = (value: unknown) =>
  typeof value === "string" ? new Date(value) : undefined;

const createExam = asyncHandler(async (req: Request, res: Response) => {
  const { name, term, examDate } = req.body;

  const exam = await examService.createExam(String(name), String(term), new Date(String(examDate)));

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Exam created successfully",
      type: "SUCCESS",
      data: exam,
    }),
  );
});

const getExam = asyncHandler(async (req: Request, res: Response) => {
  const { examId } = req.params;

  const exam = await examService.getExamById(String(examId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Exam retrieved successfully",
      type: "SUCCESS",
      data: exam,
    }),
  );
});

const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const { examId } = req.params;
  const { name, term, examDate } = req.body;

  const exam = await examService.updateExam(String(examId), {
    name: typeof name === "string" ? name : undefined,
    term: typeof term === "string" ? term : undefined,
    examDate: examDate ? new Date(String(examDate)) : undefined,
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Exam updated successfully",
      type: "SUCCESS",
      data: exam,
    }),
  );
});

const listExams = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", term, search, dateFrom, dateTo, sortBy = "examDate", sortOrder = "desc" } = req.query;

  const result = await examService.listExams({
    page: Number(page),
    limit: Number(limit),
    term: toQueryString(term),
    search: toQueryString(search),
    dateFrom: toQueryDate(dateFrom),
    dateTo: toQueryDate(dateTo),
    sortBy: toQueryString(sortBy) ?? "examDate",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Exams retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const { examId } = req.params;

  await examService.deleteExam(String(examId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Exam deleted successfully",
      type: "SUCCESS",
      data: null,
    }),
  );
});

const examController = {
  createExam,
  getExam,
  updateExam,
  listExams,
  deleteExam,
};

export default examController;
