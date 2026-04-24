import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createClassroom = async (name: string, section: string) => {
  const existing = await prisma.classRoom.findUnique({
    where: { name_section: { name, section } },
  });

  if (existing) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Classroom with this name and section already exists",
      "VALIDATION_ERROR",
    );
  }

  return prisma.classRoom.create({
    data: { name, section },
  });
};

const getClassroomById = async (classroomId: string) => {
  const classroom = await prisma.classRoom.findUnique({
    where: { id: classroomId },
    include: {
      students: true,
      _count: {
        select: { students: true },
      },
    },
  });

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
    const current = await prisma.classRoom.findUnique({ where: { id: classroomId } });
    if (!current) {
      throw new appError(
        HTTP_STATUS.NOT_FOUND,
        "Classroom not found",
        "NOT_FOUND",
      );
    }
    const existing = await prisma.classRoom.findUnique({
      where: {
        name_section: {
          name: data.name || current.name,
          section: data.section || current.section,
        },
      },
    });

    if (existing && existing.id !== classroomId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Classroom with this name and section already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return prisma.classRoom.update({
    where: { id: classroomId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.section && { section: data.section }),
    },
    include: { _count: { select: { students: true } } },
  });
};

const listClassrooms = async (params: {
  page: number;
  limit: number;
  search?: string;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { section: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [classrooms, total] = await Promise.all([
    prisma.classRoom.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: {
        [params.sortBy]: params.sortOrder,
      },
      include: { _count: { select: { students: true } } },
    }),
    prisma.classRoom.count({ where }),
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
  return prisma.classRoom.delete({
    where: { id: classroomId },
  });
};

const classroomService = {
  createClassroom,
  getClassroomById,
  updateClassroom,
  listClassrooms,
  deleteClassroom,
};

export default classroomService;
