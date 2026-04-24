import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createSubject = async (name: string, code: string) => {
  const existingCode = await prisma.subject.findUnique({
    where: { code },
  });

  if (existingCode) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Subject code already exists",
      "VALIDATION_ERROR",
    );
  }

  return prisma.subject.create({
    data: { name, code },
  });
};

const getSubjectById = async (subjectId: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

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
    const existingCode = await prisma.subject.findUnique({
      where: { code: data.code },
    });

    if (existingCode && existingCode.id !== subjectId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Subject code already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return prisma.subject.update({
    where: { id: subjectId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.code && { code: data.code }),
    },
  });
};

const listSubjects = async (params: {
  page: number;
  limit: number;
  search?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { code: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: {
        [params.sortBy]: params.sortOrder,
      },
    }),
    prisma.subject.count({ where }),
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
  return prisma.subject.delete({
    where: { id: subjectId },
  });
};

const subjectService = {
  createSubject,
  getSubjectById,
  updateSubject,
  listSubjects,
  deleteSubject,
};

export default subjectService;
