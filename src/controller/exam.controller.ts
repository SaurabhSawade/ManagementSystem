import { Request, Response } from "express";
import examService from "../service/exam.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createExam = asyncHandler(async (req: Request, res: Response) => {
  const { name, term, examDate } = req.body;

  const exam = await examService.createExam(name, term, new Date(examDate));

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

  const exam = await examService.getExamById(examId);

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

  const exam = await examService.updateExam(examId, {
    name,
    term,
    examDate: examDate ? new Date(examDate) : undefined,
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
    term: term as string,
    search: search as string,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  await examService.deleteExam(examId);

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
