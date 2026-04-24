import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createStudent = async (
  userId: string,
  rollNumber: string,
  classRoomId: string,
  guardianName?: string,
) => {
  const existingStudent = await prisma.studentProfile.findUnique({
    where: { rollNumber },
  });

  if (existingStudent) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Roll number already exists",
      "VALIDATION_ERROR",
    );
  }

  return prisma.studentProfile.create({
    data: {
      userId,
      rollNumber,
      classRoomId,
      ...(guardianName && { guardianName }),
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
      classRoom: true,
    },
  });
};

const getStudentById = async (studentId: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { id: true, username: true, email: true, phone: true } },
      classRoom: true,
    },
  });

  if (!student) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Student not found",
      "NOT_FOUND",
    );
  }

  return student;
};

const updateStudent = async (
  studentId: string,
  data: {
    rollNumber?: string;
    classRoomId?: string;
    guardianName?: string | null;
  },
) => {
  if (data.rollNumber) {
    const existingStudent = await prisma.studentProfile.findUnique({
      where: { rollNumber: data.rollNumber },
    });

    if (existingStudent && existingStudent.id !== studentId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Roll number already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return prisma.studentProfile.update({
    where: { id: studentId },
    data: {
      ...(data.rollNumber && { rollNumber: data.rollNumber }),
      ...(data.classRoomId && { classRoomId: data.classRoomId }),
      ...(data.guardianName !== undefined && { guardianName: data.guardianName }),
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
      classRoom: true,
    },
  });
};

const listStudents = async (params: {
  page: number;
  limit: number;
  classRoomId?: string;
  search?: string;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.classRoomId) where.classRoomId = params.classRoomId;
  if (params.search) {
    where.OR = [
      { rollNumber: { contains: params.search, mode: "insensitive" } },
      { user: { username: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: {
        [params.sortBy]: params.sortOrder,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        classRoom: true,
      },
    }),
    prisma.studentProfile.count({ where }),
  ]);

  return {
    data: students,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const deleteStudent = async (studentId: string) => {
  return prisma.studentProfile.delete({
    where: { id: studentId },
  });
};

const getStudentsByClassroom = async (classRoomId: string) => {
  return prisma.studentProfile.findMany({
    where: { classRoomId },
    include: {
      user: { select: { id: true, username: true, email: true } },
      classRoom: true,
    },
    orderBy: { rollNumber: "asc" },
  });
};

const studentService = {
  createStudent,
  getStudentById,
  updateStudent,
  listStudents,
  deleteStudent,
  getStudentsByClassroom,
};

export default studentService;
