import { Request, Response } from "express";
import bookService from "../service/book.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { HTTP_STATUS } from "../constants/httpStatus";

const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, isbn, author, totalCopies } = req.body;

  const book = await bookService.createBook(title, isbn, author, totalCopies);

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

  const book = await bookService.getBookById(bookId);

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

  const book = await bookService.updateBook(bookId, {
    title,
    author,
    totalCopies,
  });

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
    search: search as string,
    author: author as string,
    availableOnly: availableOnly === "true",
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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

  const issue = await bookService.issueBook(bookId, userId, new Date(dueDate));

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

  const issue = await bookService.returnBook(bookIssueId, fine);

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

  const issue = await bookService.getBookIssueById(bookIssueId);

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
    userId: userId as string,
    bookId: bookId as string,
    status: status as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
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
