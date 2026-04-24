import { z } from "zod";

const createClassroomSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50),
    section: z.string().min(1).max(50),
  }),
});

const updateClassroomSchema = z.object({
  params: z.object({
    classroomId: z.string().uuid("Invalid classroom ID"),
  }),
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    section: z.string().min(1).max(50).optional(),
  }),
});

const getClassroomSchema = z.object({
  params: z.object({
    classroomId: z.string().uuid("Invalid classroom ID"),
  }),
});

const listClassroomsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().max(100).optional(),
    sortBy: z.enum(["name", "createdAt"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const classroomValidation = {
  createClassroomSchema,
  updateClassroomSchema,
  getClassroomSchema,
  listClassroomsSchema,
};

export default classroomValidation;
