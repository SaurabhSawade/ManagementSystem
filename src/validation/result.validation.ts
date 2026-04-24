import { z } from "zod";

const getResultSchema = z.object({
  params: z.object({
    resultId: z.string().uuid("Invalid result ID"),
  }),
});

const listResultsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    studentId: z.string().uuid().optional(),
    examId: z.string().uuid().optional(),
    classRoomId: z.string().uuid().optional(),
    gradeFilter: z.string().max(2).optional(),
    sortBy: z.enum(["percentage", "totalMarks", "grade", "createdAt"]).default("percentage"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const downloadResultsSchema = z.object({
  query: z.object({
    format: z.enum(["pdf", "excel"]).default("pdf"),
    examId: z.string().uuid("Invalid exam ID").optional(),
    classRoomId: z.string().uuid("Invalid classroom ID").optional(),
  }),
});

const resultValidation = {
  getResultSchema,
  listResultsSchema,
  downloadResultsSchema,
};

export default resultValidation;
