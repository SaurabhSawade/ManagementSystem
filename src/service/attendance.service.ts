import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const markAttendance = async (
  studentId: string,
  classRoomId: string,
  subjectId: string,
  date: Date,
  status: string,
) => {
  return prisma.attendanceRecord.upsert({
    where: {
      studentId_subjectId_date: { studentId, subjectId, date },
    },
    update: { status, classRoomId },
    create: { studentId, classRoomId, subjectId, date, status },
  });
};

const bulkMarkAttendance = async (
  classRoomId: string,
  subjectId: string,
  date: Date,
  attendance: Array<{ studentId: string; status: string }>,
) => {
  const results = await Promise.all(
    attendance.map((record) =>
      markAttendance(record.studentId, classRoomId, subjectId, date, record.status),
    ),
  );

  return results;
};

const getAttendanceById = async (attendanceId: string) => {
  const record = await prisma.attendanceRecord.findUnique({
    where: { id: attendanceId },
    include: {
      student: true,
      classRoom: true,
      subject: true,
    },
  });

  if (!record) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Attendance record not found",
      "NOT_FOUND",
    );
  }

  return record;
};

const updateAttendance = async (
  attendanceId: string,
  data: { status?: string; date?: Date },
) => {
  return prisma.attendanceRecord.update({
    where: { id: attendanceId },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.date && { date: data.date }),
    },
    include: {
      student: true,
      classRoom: true,
      subject: true,
    },
  });
};

const listAttendance = async (params: {
  page: number;
  limit: number;
  studentId?: string;
  classRoomId?: string;
  subjectId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.studentId) where.studentId = params.studentId;
  if (params.classRoomId) where.classRoomId = params.classRoomId;
  if (params.subjectId) where.subjectId = params.subjectId;
  if (params.status) where.status = params.status;
  if (params.dateFrom || params.dateTo) {
    where.date = {};
    if (params.dateFrom) where.date.gte = params.dateFrom;
    if (params.dateTo) where.date.lte = params.dateTo;
  }

  const [records, total] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      include: { student: true, classRoom: true, subject: true },
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  return {
    data: records,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const getAttendanceStats = async (studentId: string) => {
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId },
  });

  const stats: any = {
    total: records.length,
    present: records.filter((r) => r.status === "PRESENT").length,
    absent: records.filter((r) => r.status === "ABSENT").length,
    leave: records.filter((r) => r.status === "LEAVE").length,
    sick: records.filter((r) => r.status === "SICK").length,
  };

  stats.percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

  return stats;
};

const attendanceService = {
  markAttendance,
  bulkMarkAttendance,
  getAttendanceById,
  updateAttendance,
  listAttendance,
  getAttendanceStats,
};

export default attendanceService;
