import { Request, Response } from "express";
import marksService from "../service/marks.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createMark = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, classRoomId, subjectId, examId, marks, maxMarks } = req.body;

  const mark = await marksService.createMark(
    studentId,
    classRoomId,
    subjectId,
    examId,
    marks,
    maxMarks,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Mark created successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const bulkCreateMarks = asyncHandler(async (req: Request, res: Response) => {
  const { examId, subjectId, classRoomId, marks } = req.body;

  const results = await marksService.bulkCreateMarks(
    examId,
    subjectId,
    classRoomId,
    marks,
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Marks created for all students",
      type: "SUCCESS",
      data: { count: results.length, records: results },
    }),
  );
});

const getMark = asyncHandler(async (req: Request, res: Response) => {
  const { markId } = req.params;

  const mark = await marksService.getMarkById(markId);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Mark retrieved successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const updateMark = asyncHandler(async (req: Request, res: Response) => {
  const { markId } = req.params;
  const { marks, maxMarks } = req.body;

  const mark = await marksService.updateMark(markId, { marks, maxMarks });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Mark updated successfully",
      type: "SUCCESS",
      data: mark,
    }),
  );
});

const listMarks = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", studentId, subjectId, examId, classRoomId, sortBy = "marks", sortOrder = "desc" } = req.query;

  const result = await marksService.listMarks({
    page: Number(page),
    limit: Number(limit),
    studentId: studentId as string,
    subjectId: subjectId as string,
    examId: examId as string,
    classRoomId: classRoomId as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Marks retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const getStudentMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const marks = await marksService.getStudentMarks(studentId);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Student marks retrieved successfully",
      type: "SUCCESS",
      data: marks,
    }),
  );
});

const marksController = {
  createMark,
  bulkCreateMarks,
  getMark,
  updateMark,
  listMarks,
  getStudentMarks,
};

export default marksController;
