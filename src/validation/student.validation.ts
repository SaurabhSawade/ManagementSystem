import { z } from "zod";

const updateStudentSchema = z.object({
  params: z.object({
    studentId: z.string().uuid("Invalid student ID"),
  }),
  body: z.object({
    rollNumber: z.string().min(1).max(50).optional(),
    classRoomId: z.string().uuid("Invalid classroom ID").optional(),
    guardianName: z.string().min(2).max(100).optional(),
  }),
});

const getStudentSchema = z.object({
  params: z.object({
    studentId: z.string().uuid("Invalid student ID"),
  }),
});

const listStudentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    classRoomId: z.string().uuid().optional(),
    search: z.string().max(100).optional(),
    sortBy: z.enum(["rollNumber", "createdAt"]).default("rollNumber"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const studentValidation = {
  updateStudentSchema,
  getStudentSchema,
  listStudentsSchema,
};

export default studentValidation;
