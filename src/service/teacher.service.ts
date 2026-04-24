import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createTeacher = async (
  userId: string,
  employeeId: string,
  department?: string,
) => {
  const existingTeacher = await prisma.teacherProfile.findUnique({
    where: { employeeId },
  });

  if (existingTeacher) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Employee ID already exists",
      "VALIDATION_ERROR",
    );
  }

  return prisma.teacherProfile.create({
    data: {
      userId,
      employeeId,
      ...(department && { department }),
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  });
};

const getTeacherById = async (teacherId: string) => {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    include: {
      user: { select: { id: true, username: true, email: true, phone: true } },
    },
  });

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
    const existingTeacher = await prisma.teacherProfile.findUnique({
      where: { employeeId: data.employeeId },
    });

    if (existingTeacher && existingTeacher.id !== teacherId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Employee ID already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      ...(data.employeeId && { employeeId: data.employeeId }),
      ...(data.department !== undefined && { department: data.department }),
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  });
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

  const where: any = {};
  if (params.department) where.department = params.department;
  if (params.search) {
    where.OR = [
      { employeeId: { contains: params.search, mode: "insensitive" } },
      { user: { username: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  const [teachers, total] = await Promise.all([
    prisma.teacherProfile.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: {
        [params.sortBy]: params.sortOrder,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    }),
    prisma.teacherProfile.count({ where }),
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
  return prisma.teacherProfile.delete({
    where: { id: teacherId },
  });
};

const teacherService = {
  createTeacher,
  getTeacherById,
  updateTeacher,
  listTeachers,
  deleteTeacher,
};

export default teacherService;
