import { Router } from "express";
import bookRouter from "../book.routes";
import profileRouter from "../profile.routes";

const libraryAreaRouter = Router();

libraryAreaRouter.use("/profile", profileRouter);
libraryAreaRouter.use("/books", bookRouter);

export default libraryAreaRouter;
