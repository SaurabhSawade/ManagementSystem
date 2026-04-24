import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const getResultById = async (resultId: string) => {
  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { student: true, classRoom: true, exam: true },
  });

  if (!result) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Result not found",
      "NOT_FOUND",
    );
  }

  return result;
};

const listResults = async (params: {
  page: number;
  limit: number;
  studentId?: string;
  examId?: string;
  classRoomId?: string;
  gradeFilter?: string;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.studentId) where.studentId = params.studentId;
  if (params.examId) where.examId = params.examId;
  if (params.classRoomId) where.classRoomId = params.classRoomId;
  if (params.gradeFilter) where.grade = params.gradeFilter;

  const [results, total] = await Promise.all([
    prisma.result.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      include: { student: true, classRoom: true, exam: true },
    }),
    prisma.result.count({ where }),
  ]);

  return {
    data: results,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const getStudentResults = async (studentId: string) => {
  return prisma.result.findMany({
    where: { studentId },
    include: { exam: true, classRoom: true },
    orderBy: { createdAt: "desc" },
  });
};

const calculateAndCreateResult = async (
  studentId: string,
  classRoomId: string,
  examId: string,
) => {
  const marks = await prisma.mark.findMany({
    where: { studentId, classRoomId, examId },
  });

  if (marks.length === 0) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "No marks found for this student in this exam",
      "NOT_FOUND",
    );
  }

  const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
  const maxMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const percentage = (totalMarks / maxMarks) * 100;

  let grade = "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";
  else if (percentage >= 50) grade = "E";

  return prisma.result.upsert({
    where: { studentId_examId: { studentId, examId } },
    update: { totalMarks, percentage, grade, classRoomId },
    create: { studentId, classRoomId, examId, totalMarks, percentage, grade },
  });
};

const resultService = {
  getResultById,
  listResults,
  getStudentResults,
  calculateAndCreateResult,
};

export default resultService;
