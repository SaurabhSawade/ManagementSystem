import type { Prisma } from "../generated/prisma/client";
import studentModel from "../model/student.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createStudent = async (
  userId: string,
  rollNumber: string,
  classRoomId: string,
  guardianName?: string,
) => {
  const existingStudent = await studentModel.findByRollNumber(rollNumber);

  if (existingStudent) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Roll number already exists",
      "VALIDATION_ERROR",
    );
  }

  return studentModel.create({
    userId,
    rollNumber,
    classRoomId,
    ...(guardianName && { guardianName }),
  });
};

const getStudentById = async (studentId: string) => {
  const student = await studentModel.findByIdWithDetails(studentId);

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
    const existingStudent = await studentModel.findByRollNumber(data.rollNumber);

    if (existingStudent && existingStudent.id !== studentId) {
      throw new appError(
        HTTP_STATUS.CONFLICT,
        "Roll number already exists",
        "VALIDATION_ERROR",
      );
    }
  }

  return studentModel.updateById(studentId, data);
};

const listStudents = async (params: {
  page: number;
  limit: number;
  classRoomId?: string | undefined;
  search?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.StudentProfileWhereInput = {};
  if (params.classRoomId) where.classRoomId = params.classRoomId;
  if (params.search) {
    where.OR = [
      { rollNumber: { contains: params.search, mode: "insensitive" } },
      { user: { username: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  const [students, total] = await Promise.all([
    studentModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    studentModel.count(where),
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
  return studentModel.deleteById(studentId);
};

const getStudentsByClassroom = async (classRoomId: string) => {
  return studentModel.findByClassroomId(classRoomId);
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
