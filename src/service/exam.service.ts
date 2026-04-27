import type { Prisma } from "../generated/prisma/client";
import examModel from "../model/exam.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createExam = async (name: string, term: string, examDate: Date) => {
  return examModel.create(name, term, examDate);
};

const getExamById = async (examId: string) => {
  const exam = await examModel.findById(examId);

  if (!exam) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Exam not found",
      "NOT_FOUND",
    );
  }

  return exam;
};

const updateExam = async (
  examId: string,
  data: {
    name?: string;
    term?: string;
    examDate?: Date;
  },
) => {
  return examModel.updateById(examId, data);
};

const listExams = async (params: {
  page: number;
  limit: number;
  term?: string | undefined;
  search?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.ExamWhereInput = {};
  if (params.term) where.term = params.term;
  if (params.search) where.name = { contains: params.search, mode: "insensitive" };
  if (params.dateFrom || params.dateTo) {
    where.examDate = {};
    if (params.dateFrom) where.examDate.gte = params.dateFrom;
    if (params.dateTo) where.examDate.lte = params.dateTo;
  }

  const [exams, total] = await Promise.all([
    examModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    examModel.count(where),
  ]);

  return {
    data: exams,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const deleteExam = async (examId: string) => {
  return examModel.deleteById(examId);
};

const examService = {
  createExam,
  getExamById,
  updateExam,
  listExams,
  deleteExam,
};

export default examService;
