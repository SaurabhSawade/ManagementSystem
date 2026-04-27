import type { Prisma } from "../generated/prisma/client";
import subjectModel from "../model/subject.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createSubject = async (name: string, code: string) => {
  const existingCode = await subjectModel.findByCode(code);

  if (existingCode) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Subject code already exists",
      "VALIDATION_ERROR",
    );
  }

  return subjectModel.create(name, code);
};

const getSubjectById = async (subjectId: string) => {
  const subject = await subjectModel.findById(subjectId);

  if (!subject) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Subject not found",
      "NOT_FOUND",
    );
  }

  return subject;
};

const updateSubject = async (
  subjectId: string,
  data: {
    name?: string;
    code?: string;
  },
) => {
  if (data.code) {
    const existingCode = await subjectModel.findByCode(data.code);

    if (existingCode && existingCode.id !== subjectId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Subject code already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return subjectModel.updateById(subjectId, data);
};

const listSubjects = async (params: {
  page: number;
  limit: number;
  search?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.SubjectWhereInput = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { code: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [subjects, total] = await Promise.all([
    subjectModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    subjectModel.count(where),
  ]);

  return {
    data: subjects,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const deleteSubject = async (subjectId: string) => {
  return subjectModel.deleteById(subjectId);
};

const subjectService = {
  createSubject,
  getSubjectById,
  updateSubject,
  listSubjects,
  deleteSubject,
};

export default subjectService;
