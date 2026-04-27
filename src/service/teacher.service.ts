import type { Prisma } from "../generated/prisma/client";
import teacherModel from "../model/teacher.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createTeacher = async (
  userId: string,
  employeeId: string,
  department?: string,
) => {
  const existingTeacher = await teacherModel.findByEmployeeId(employeeId);

  if (existingTeacher) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Employee ID already exists",
      "VALIDATION_ERROR",
    );
  }

  return teacherModel.create({
    userId,
    employeeId,
    ...(department && { department }),
  });
};

const getTeacherById = async (teacherId: string) => {
  const teacher = await teacherModel.findByIdWithDetails(teacherId);

  if (!teacher) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Teacher not found",
      "NOT_FOUND",
    );
  }

  return teacher;
};

const updateTeacher = async (
  teacherId: string,
  data: {
    employeeId?: string;
    department?: string | null;
  },
) => {
  if (data.employeeId) {
    const existingTeacher = await teacherModel.findByEmployeeId(data.employeeId);

    if (existingTeacher && existingTeacher.id !== teacherId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Employee ID already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return teacherModel.updateById(teacherId, data);
};

const listTeachers = async (params: {
  page: number;
  limit: number;
  department?: string | undefined;
  search?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.TeacherProfileWhereInput = {};
  if (params.department) where.department = params.department;
  if (params.search) {
    where.OR = [
      { employeeId: { contains: params.search, mode: "insensitive" } },
      { user: { username: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  const [teachers, total] = await Promise.all([
    teacherModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    teacherModel.count(where),
  ]);

  return {
    data: teachers,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const deleteTeacher = async (teacherId: string) => {
  return teacherModel.deleteById(teacherId);
};

const teacherService = {
  createTeacher,
  getTeacherById,
  updateTeacher,
  listTeachers,
  deleteTeacher,
};

export default teacherService;
