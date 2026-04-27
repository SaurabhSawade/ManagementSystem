import type { Prisma } from "../generated/prisma/client";
import marksModel from "../model/marks.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createMark = async (
  studentId: string,
  classRoomId: string,
  subjectId: string,
  examId: string,
  marks: number,
  maxMarks: number,
) => {
  if (marks > maxMarks) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Marks cannot exceed max marks",
      "VALIDATION_ERROR",
    );
  }

  return marksModel.upsertMark({
    studentId,
    classRoomId,
    subjectId,
    examId,
    marks,
    maxMarks,
  });
};

const bulkCreateMarks = async (
  examId: string,
  subjectId: string,
  classRoomId: string,
  marks: Array<{ studentId: string; marks: number; maxMarks: number }>,
) => {
  const results = await Promise.all(
    marks.map((mark) =>
      createMark(mark.studentId, classRoomId, subjectId, examId, mark.marks, mark.maxMarks),
    ),
  );

  return results;
};

const getMarkById = async (markId: string) => {
  const mark = await marksModel.findByIdWithDetails(markId);

  if (!mark) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Mark record not found",
      "NOT_FOUND",
    );
  }

  return mark;
};

const updateMark = async (
  markId: string,
  data: { marks?: number; maxMarks?: number },
) => {
  const mark = await getMarkById(markId);

  if (data.marks !== undefined && data.marks > (data.maxMarks || mark.maxMarks)) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Marks cannot exceed max marks",
      "VALIDATION_ERROR",
    );
  }

  return marksModel.updateById(markId, data);
};

const listMarks = async (params: {
  page: number;
  limit: number;
  studentId?: string | undefined;
  subjectId?: string | undefined;
  examId?: string | undefined;
  classRoomId?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.MarkWhereInput = {};
  if (params.studentId) where.studentId = params.studentId;
  if (params.subjectId) where.subjectId = params.subjectId;
  if (params.examId) where.examId = params.examId;
  if (params.classRoomId) where.classRoomId = params.classRoomId;

  const [records, total] = await Promise.all([
    marksModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    marksModel.count(where),
  ]);

  return {
    data: records,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const getStudentMarks = async (studentId: string) => {
  return marksModel.findManyByStudentId(studentId);
};

const marksService = {
  createMark,
  bulkCreateMarks,
  getMarkById,
  updateMark,
  listMarks,
  getStudentMarks,
};

export default marksService;
