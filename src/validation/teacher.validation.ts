import { z } from "zod";

const createTeacherSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    employeeId: z.string().min(1).max(50),
    department: z.string().min(2).max(100).optional(),
  }),
});

const updateTeacherSchema = z.object({
  params: z.object({
    teacherId: z.string().uuid("Invalid teacher ID"),
  }),
  body: z.object({
    employeeId: z.string().min(1).max(50).optional(),
    department: z.string().min(2).max(100).optional(),
  }),
});

const getTeacherSchema = z.object({
  params: z.object({
    teacherId: z.string().uuid("Invalid teacher ID"),
  }),
});

const listTeachersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    department: z.string().max(100).optional(),
    search: z.string().max(100).optional(),
    sortBy: z.enum(["employeeId", "createdAt"]).default("employeeId"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const teacherValidation = {
  createTeacherSchema,
  updateTeacherSchema,
  getTeacherSchema,
  listTeachersSchema,
};

export default teacherValidation;
