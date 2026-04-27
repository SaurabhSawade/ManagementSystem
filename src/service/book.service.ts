import type { Prisma } from "../generated/prisma/client";
import bookModel from "../model/book.model";
import appError from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const createBook = async (
  title: string,
  isbn: string,
  author: string,
  totalCopies: number,
) => {
  const existingIsbn = await bookModel.findByIsbn(isbn);

  if (existingIsbn) {
    throw new appError(
      HTTP_STATUS.CONFLICT,
      "Book with this ISBN already exists",
      "VALIDATION_ERROR",
    );
  }

  return bookModel.create({
    title,
    isbn,
    author,
    totalCopies,
  });
};

const getBookById = async (bookId: string) => {
  const book = await bookModel.findById(bookId);

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
  return bookModel.updateById(bookId, data);
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

  const where: Prisma.BookWhereInput = {};
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { isbn: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.author) where.author = { contains: params.author, mode: "insensitive" };
  if (params.availableOnly) where.available = { gt: 0 };

  const [books, total] = await Promise.all([
    bookModel.findMany({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    bookModel.count(where),
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

  await bookModel.updateAvailability(bookId, book.available - 1);

  return bookModel.createIssue({ bookId, userId, dueDate });
};

const returnBook = async (bookIssueId: string, fineAmount?: number) => {
  const issue = await bookModel.findIssueById(bookIssueId);

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
  await bookModel.updateAvailability(issue.bookId, book.available + 1);

  return bookModel.returnIssue(bookIssueId, fineAmount ?? 0);
};

const getBookIssueById = async (bookIssueId: string) => {
  const issue = await bookModel.findIssueByIdWithDetails(bookIssueId);

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

  const where: Prisma.BookIssueWhereInput = {};
  if (params.userId) where.userId = params.userId;
  if (params.bookId) where.bookId = params.bookId;
  if (params.status === "ACTIVE") where.returnDate = null;
  else if (params.status === "RETURNED") where.returnDate = { not: null };

  const [issues, total] = await Promise.all([
    bookModel.findManyIssues({
      where,
      skip,
      take: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    bookModel.countIssues(where),
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
