import { Request, Response } from "express";
import bookService from "../service/book.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const toQueryString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, isbn, author, totalCopies } = req.body;

  const book = await bookService.createBook(
    String(title),
    String(isbn),
    String(author),
    Number(totalCopies),
  );

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Book created successfully",
      type: "SUCCESS",
      data: book,
    }),
  );
});

const getBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId } = req.params;

  const book = await bookService.getBookById(String(bookId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Book retrieved successfully",
      type: "SUCCESS",
      data: book,
    }),
  );
});

const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { title, author, totalCopies } = req.body;

  const updateData: {
    title?: string;
    author?: string;
    totalCopies?: number;
  } = {};

  if (typeof title === "string") updateData.title = title;
  if (typeof author === "string") updateData.author = author;
  if (totalCopies !== undefined) {
    updateData.totalCopies = typeof totalCopies === "number" ? totalCopies : Number(totalCopies);
  }

  const book = await bookService.updateBook(String(bookId), updateData);

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Book updated successfully",
      type: "SUCCESS",
      data: book,
    }),
  );
});

const listBooks = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", search, author, availableOnly, sortBy = "title", sortOrder = "asc" } = req.query;

  const result = await bookService.listBooks({
    page: Number(page),
    limit: Number(limit),
    search: toQueryString(search),
    author: toQueryString(author),
    availableOnly: availableOnly === "true",
    sortBy: toQueryString(sortBy) ?? "title",
    sortOrder: toQueryString(sortOrder) ?? "asc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Books retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const issueBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId, userId, dueDate } = req.body;

  const issue = await bookService.issueBook(String(bookId), String(userId), new Date(String(dueDate)));

  res.status(HTTP_STATUS.CREATED).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.CREATED,
      success: true,
      message: "Book issued successfully",
      type: "SUCCESS",
      data: issue,
    }),
  );
});

const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookIssueId } = req.params;
  const { fine } = req.body;

  const issue = await bookService.returnBook(String(bookIssueId), typeof fine === "number" ? fine : Number(fine));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Book returned successfully",
      type: "SUCCESS",
      data: issue,
    }),
  );
});

const getBookIssue = asyncHandler(async (req: Request, res: Response) => {
  const { bookIssueId } = req.params;

  const issue = await bookService.getBookIssueById(String(bookIssueId));

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Book issue record retrieved successfully",
      type: "SUCCESS",
      data: issue,
    }),
  );
});

const listBookIssues = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", userId, bookId, status, sortBy = "issueDate", sortOrder = "desc" } = req.query;

  const result = await bookService.listBookIssues({
    page: Number(page),
    limit: Number(limit),
    userId: toQueryString(userId),
    bookId: toQueryString(bookId),
    status: toQueryString(status),
    sortBy: toQueryString(sortBy) ?? "issueDate",
    sortOrder: toQueryString(sortOrder) ?? "desc",
  });

  res.status(HTTP_STATUS.OK).json(
    apiResponse.buildResponse({
      status: HTTP_STATUS.OK,
      success: true,
      message: "Book issue records retrieved successfully",
      type: "SUCCESS",
      data: result,
    }),
  );
});

const bookController = {
  createBook,
  getBook,
  updateBook,
  listBooks,
  issueBook,
  returnBook,
  getBookIssue,
  listBookIssues,
};

export default bookController;
