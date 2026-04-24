import { z } from "zod";

const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    code: z.string().min(1).max(20),
  }),
});

const updateSubjectSchema = z.object({
  params: z.object({
    subjectId: z.string().uuid("Invalid subject ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    code: z.string().min(1).max(20).optional(),
  }),
});

const getSubjectSchema = z.object({
  params: z.object({
    subjectId: z.string().uuid("Invalid subject ID"),
  }),
});

const listSubjectsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().max(100).optional(),
    sortBy: z.enum(["name", "code", "createdAt"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const subjectValidation = {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema,
  listSubjectsSchema,
};

export default subjectValidation;
