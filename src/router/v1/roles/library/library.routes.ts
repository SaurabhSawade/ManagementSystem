import { Router } from "express";
import bookRouter from "../../resources/book/book.routes";

const libraryAreaRouter = Router();

libraryAreaRouter.use("/books", bookRouter);

export default libraryAreaRouter;
