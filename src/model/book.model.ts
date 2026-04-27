import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const bookModel = {
  findByIsbn: (isbn: string) =>
    prisma.book.findUnique({
      where: { isbn },
    }),

  create: (data: { title: string; isbn: string; author: string; totalCopies: number }) =>
    prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        author: data.author,
        totalCopies: data.totalCopies,
        available: data.totalCopies,
      },
    }),

  findById: (bookId: string) =>
    prisma.book.findUnique({
      where: { id: bookId },
    }),

  updateById: (
    bookId: string,
    data: {
      title?: string;
      author?: string;
      totalCopies?: number;
    },
  ) =>
    prisma.book.update({
      where: { id: bookId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.author && { author: data.author }),
        ...(data.totalCopies && { totalCopies: data.totalCopies }),
      },
    }),

  updateAvailability: (bookId: string, available: number) =>
    prisma.book.update({
      where: { id: bookId },
      data: { available },
    }),

  findMany: (params: {
    where: Prisma.BookWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.book.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
    }),

  count: (where: Prisma.BookWhereInput) => prisma.book.count({ where }),

  createIssue: (data: { bookId: string; userId: string; dueDate: Date }) =>
    prisma.bookIssue.create({
      data: {
        bookId: data.bookId,
        userId: data.userId,
        issueDate: new Date(),
        dueDate: data.dueDate,
      },
      include: {
        book: true,
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  findIssueById: (bookIssueId: string) =>
    prisma.bookIssue.findUnique({
      where: { id: bookIssueId },
    }),

  findIssueByIdWithDetails: (bookIssueId: string) =>
    prisma.bookIssue.findUnique({
      where: { id: bookIssueId },
      include: {
        book: true,
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  returnIssue: (bookIssueId: string, fineAmount: number) =>
    prisma.bookIssue.update({
      where: { id: bookIssueId },
      data: {
        returnDate: new Date(),
        fineAmount,
      },
      include: {
        book: true,
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  findManyIssues: (params: {
    where: Prisma.BookIssueWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.bookIssue.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.sortBy]: params.sortOrder as Prisma.SortOrder },
      include: {
        book: true,
        user: { select: { id: true, username: true, email: true } },
      },
    }),

  countIssues: (where: Prisma.BookIssueWhereInput) => prisma.bookIssue.count({ where }),
};

export default bookModel;
