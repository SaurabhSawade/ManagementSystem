import { Router } from "express";
import attendanceRouter from "../attendance.routes";
import bookRouter from "../book.routes";
import feeRouter from "../fee.routes";
import marksRouter from "../marks.routes";
import resultRouter from "../result.routes";

const studentAreaRouter = Router();

studentAreaRouter.use("/attendance", attendanceRouter);
studentAreaRouter.use("/marks", marksRouter);
studentAreaRouter.use("/results", resultRouter);
studentAreaRouter.use("/fees", feeRouter);
studentAreaRouter.use("/books", bookRouter);

export default studentAreaRouter;
