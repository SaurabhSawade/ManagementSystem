import type { Prisma } from "../generated/prisma/client";
import classroomModel from "../model/classroom.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createClassroom = async (name: string, section: string) => {
  const existing = await classroomModel.findByNameSection(name, section);

  if (existing) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Classroom with this name and section already exists",
      "VALIDATION_ERROR",
    );
  }

  return classroomModel.create(name, section);
};

const getClassroomById = async (classroomId: string) => {
  const classroom = await classroomModel.findByIdWithStudents(classroomId);

  if (!classroom) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Classroom not found",
      "NOT_FOUND",
    );
  }

  return classroom;
};

const updateClassroom = async (
  classroomId: string,
  data: {
    name?: string;
    section?: string;
  },
) => {
  if (data.name || data.section) {
    const current = await classroomModel.findById(classroomId);
    if (!current) {
      throw new appError(
        HTTP_STATUS.NOT_FOUND,
        "Classroom not found",
        "NOT_FOUND",
      );
    }
    const existing = await classroomModel.findByNameSection(
      data.name || current.name,
      data.section || current.section,
    );

    if (existing && existing.id !== classroomId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Classroom with this name and section already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return classroomModel.updateById(classroomId, data);
};

const listClassrooms = async (params: {
  page: number;
  limit: number;
  search?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.ClassRoomWhereInput = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { section: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [classrooms, total] = await Promise.all([
    classroomModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    classroomModel.count(where),
  ]);

  return {
    data: classrooms,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const deleteClassroom = async (classroomId: string) => {
  return classroomModel.deleteById(classroomId);
};

const classroomService = {
  createClassroom,
  getClassroomById,
  updateClassroom,
  listClassrooms,
  deleteClassroom,
};

export default classroomService;
