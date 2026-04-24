import { prisma } from "../config/prisma";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createBook = async (
  title: string,
  isbn: string,
  author: string,
  totalCopies: number,
) => {
  const existingIsbn = await prisma.book.findUnique({
    where: { isbn },
  });

  if (existingIsbn) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Book with this ISBN already exists",
      "VALIDATION_ERROR",
    );
  }

  return prisma.book.create({
    data: {
      title,
      isbn,
      author,
      totalCopies,
      available: totalCopies,
    },
  });
};

const getBookById = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Book not found",
      "NOT_FOUND",
    );
  }

  return book;
};

const updateBook = async (
  bookId: string,
  data: {
    title?: string;
    author?: string;
    totalCopies?: number;
  },
) => {
  return prisma.book.update({
    where: { id: bookId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.author && { author: data.author }),
      ...(data.totalCopies && { totalCopies: data.totalCopies }),
    },
  });
};

const listBooks = async (params: {
  page: number;
  limit: number;
  search?: string | undefined;
  author?: string | undefined;
  availableOnly?: boolean | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { isbn: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.author) where.author = { contains: params.author, mode: "insensitive" };
  if (params.availableOnly) where.available = { gt: 0 };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.book.count({ where }),
  ]);

  return {
    data: books,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const issueBook = async (bookId: string, userId: string, dueDate: Date) => {
  const book = await getBookById(bookId);

  if (book.available <= 0) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Book is not available",
      "VALIDATION_ERROR",
    );
  }

  await prisma.book.update({
    where: { id: bookId },
    data: { available: book.available - 1 },
  });

  return prisma.bookIssue.create({
    data: {
      bookId,
      userId,
      issueDate: new Date(),
      dueDate,
    },
    include: {
      book: true,
      user: { select: { id: true, username: true, email: true } },
    },
  });
};

const returnBook = async (bookIssueId: string, fineAmount?: number) => {
  const issue = await prisma.bookIssue.findUnique({
    where: { id: bookIssueId },
  });

  if (!issue) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Book issue record not found",
      "NOT_FOUND",
    );
  }

  if (issue.returnDate) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Book already returned",
      "VALIDATION_ERROR",
    );
  }

  const book = await getBookById(issue.bookId);
  await prisma.book.update({
    where: { id: issue.bookId },
    data: { available: book.available + 1 },
  });

  return prisma.bookIssue.update({
    where: { id: bookIssueId },
    data: {
      returnDate: new Date(),
      fineAmount: fineAmount ?? 0,
    },
    include: {
      book: true,
      user: { select: { id: true, username: true, email: true } },
    },
  });
};

const getBookIssueById = async (bookIssueId: string) => {
  const issue = await prisma.bookIssue.findUnique({
    where: { id: bookIssueId },
    include: {
      book: true,
      user: { select: { id: true, username: true, email: true } },
    },
  });

  if (!issue) {
    throw new appError(
      HTTP_STATUS.NOT_FOUND,
      "Book issue record not found",
      "NOT_FOUND",
    );
  }

  return issue;
};

const listBookIssues = async (params: {
  page: number;
  limit: number;
  userId?: string | undefined;
  bookId?: string | undefined;
  status?: string | undefined;
  sortBy: string;
  sortOrder: string;
}) => {
  const skip = (params.page - 1) * params.limit;

  const where: any = {};
  if (params.userId) where.userId = params.userId;
  if (params.bookId) where.bookId = params.bookId;
  if (params.status === "ACTIVE") where.returnDate = null;
  else if (params.status === "RETURNED") where.returnDate = { not: null };

  const [issues, total] = await Promise.all([
    prisma.bookIssue.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      include: {
        book: true,
        user: { select: { id: true, username: true, email: true } },
      },
    }),
    prisma.bookIssue.count({ where }),
  ]);

  return {
    data: issues,
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
};

const bookService = {
  createBook,
  getBookById,
  updateBook,
  listBooks,
  issueBook,
  returnBook,
  getBookIssueById,
  listBookIssues,
};

export default bookService;
