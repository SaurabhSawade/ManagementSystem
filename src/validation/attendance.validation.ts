import { z } from "zod";

const createAttendanceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid("Invalid student ID"),
    classRoomId: z.string().uuid("Invalid classroom ID"),
    subjectId: z.string().uuid("Invalid subject ID"),
    date: z.string().datetime(),
    status: z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]),
  }),
});

const updateAttendanceSchema = z.object({
  params: z.object({
    attendanceId: z.string().uuid("Invalid attendance ID"),
  }),
  body: z.object({
    status: z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]).optional(),
    date: z.string().datetime().optional(),
  }),
});

const getAttendanceSchema = z.object({
  params: z.object({
    attendanceId: z.string().uuid("Invalid attendance ID"),
  }),
});

const listAttendanceSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    studentId: z.string().uuid().optional(),
    classRoomId: z.string().uuid().optional(),
    subjectId: z.string().uuid().optional(),
    status: z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    sortBy: z.enum(["date", "status", "createdAt"]).default("date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const bulkMarkAttendanceSchema = z.object({
  body: z.object({
    classRoomId: z.string().uuid("Invalid classroom ID"),
    subjectId: z.string().uuid("Invalid subject ID"),
    date: z.string().datetime(),
    attendance: z.array(
      z.object({
        studentId: z.string().uuid("Invalid student ID"),
        status: z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]),
      }),
    ).min(1),
  }),
});

const attendanceValidation = {
  createAttendanceSchema,
  updateAttendanceSchema,
  getAttendanceSchema,
  listAttendanceSchema,
  bulkMarkAttendanceSchema,
};

export default attendanceValidation;
