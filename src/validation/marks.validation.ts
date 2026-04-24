import { z } from "zod";

const createMarkSchema = z.object({
  body: z.object({
    studentId: z.string().uuid("Invalid student ID"),
    classRoomId: z.string().uuid("Invalid classroom ID"),
    subjectId: z.string().uuid("Invalid subject ID"),
    examId: z.string().uuid("Invalid exam ID"),
    marks: z.number().min(0),
    maxMarks: z.number().min(0),
  }),
});

const updateMarkSchema = z.object({
  params: z.object({
    markId: z.string().uuid("Invalid mark ID"),
  }),
  body: z.object({
    marks: z.number().min(0).optional(),
    maxMarks: z.number().min(0).optional(),
  }),
});

const getMarkSchema = z.object({
  params: z.object({
    markId: z.string().uuid("Invalid mark ID"),
  }),
});

const listMarksSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    studentId: z.string().uuid().optional(),
    subjectId: z.string().uuid().optional(),
    examId: z.string().uuid().optional(),
    classRoomId: z.string().uuid().optional(),
    sortBy: z.enum(["marks", "studentId", "createdAt"]).default("marks"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const bulkCreateMarksSchema = z.object({
  body: z.object({
    examId: z.string().uuid("Invalid exam ID"),
    subjectId: z.string().uuid("Invalid subject ID"),
    classRoomId: z.string().uuid("Invalid classroom ID"),
    marks: z.array(
      z.object({
        studentId: z.string().uuid("Invalid student ID"),
        marks: z.number().min(0),
        maxMarks: z.number().min(0),
      }),
    ).min(1),
  }),
});

const marksValidation = {
  createMarkSchema,
  updateMarkSchema,
  getMarkSchema,
  listMarksSchema,
  bulkCreateMarksSchema,
};

export default marksValidation;
