import { z } from "zod";

const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    isbn: z.string().min(10).max(20),
    author: z.string().min(2).max(100),
    totalCopies: z.number().int().positive("Total copies must be positive"),
  }),
});

const updateBookSchema = z.object({
  params: z.object({
    bookId: z.string().uuid("Invalid book ID"),
  }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    author: z.string().min(2).max(100).optional(),
    totalCopies: z.number().int().positive().optional(),
  }),
});

const getBookSchema = z.object({
  params: z.object({
    bookId: z.string().uuid("Invalid book ID"),
  }),
});

const listBooksSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().max(100).optional(),
    author: z.string().max(100).optional(),
    availableOnly: z.coerce.boolean().default(false),
    sortBy: z.enum(["title", "author", "available", "createdAt"]).default("title"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const issueBookSchema = z.object({
  body: z.object({
    bookId: z.string().uuid("Invalid book ID"),
    userId: z.string().uuid("Invalid user ID"),
    dueDate: z.string().datetime(),
  }),
});

const returnBookSchema = z.object({
  params: z.object({
    bookIssueId: z.string().uuid("Invalid book issue ID"),
  }),
  body: z.object({
    fine: z.number().min(0).optional(),
  }),
});

const getBookIssueSchema = z.object({
  params: z.object({
    bookIssueId: z.string().uuid("Invalid book issue ID"),
  }),
});

const listBookIssuesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    userId: z.string().uuid().optional(),
    bookId: z.string().uuid().optional(),
    status: z.enum(["ACTIVE", "RETURNED"]).optional(),
    sortBy: z.enum(["issueDate", "dueDate", "createdAt"]).default("issueDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const bookValidation = {
  createBookSchema,
  updateBookSchema,
  getBookSchema,
  listBooksSchema,
  issueBookSchema,
  returnBookSchema,
  getBookIssueSchema,
  listBookIssuesSchema,
};

export default bookValidation;
