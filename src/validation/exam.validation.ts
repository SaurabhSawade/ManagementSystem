import { z } from "zod";

const createExamSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    term: z.string().min(1).max(50),
    examDate: z.string().datetime(),
  }),
});

const updateExamSchema = z.object({
  params: z.object({
    examId: z.string().uuid("Invalid exam ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    term: z.string().min(1).max(50).optional(),
    examDate: z.string().datetime().optional(),
  }),
});

const getExamSchema = z.object({
  params: z.object({
    examId: z.string().uuid("Invalid exam ID"),
  }),
});

const listExamsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    term: z.string().max(50).optional(),
    search: z.string().max(100).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    sortBy: z.enum(["examDate", "name", "createdAt"]).default("examDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const deleteExamSchema = z.object({
  params: z.object({
    examId: z.string().uuid("Invalid exam ID"),
  }),
});

const examValidation = {
  createExamSchema,
  updateExamSchema,
  getExamSchema,
  listExamsSchema,
  deleteExamSchema,
};

export default examValidation;
