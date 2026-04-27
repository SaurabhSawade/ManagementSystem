import type { Prisma } from "../generated/prisma/client";
import attendanceModel from "../model/attendance.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const markAttendance = async (
  studentId: string,
  classRoomId: string,
  subjectId: string,
  date: Date,
  status: string,
) => {
  return attendanceModel.upsertAttendance({
    studentId,
    classRoomId,
    subjectId,
    date,
    status,
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
  const record = await attendanceModel.findByIdWithDetails(attendanceId);

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
  return attendanceModel.updateById(attendanceId, data);
};

const listAttendance = async (params: {
  page: number;
  limit: number;
  studentId?: string | undefined;
  classRoomId?: string | undefined;
  subjectId?: string | undefined;
  status?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: Prisma.AttendanceRecordWhereInput = {};
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
    attendanceModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    attendanceModel.count(where),
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
  const records = await attendanceModel.findManyByStudentId(studentId);

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
