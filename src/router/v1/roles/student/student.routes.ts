import { Router } from "express";
import attendanceRouter from "../../resources/attendance/attendance.routes";
import bookRouter from "../../resources/book/book.routes";
import feeRouter from "../../resources/fee/fee.routes";
import marksRouter from "../../resources/marks/marks.routes";
import resultRouter from "../../resources/result/result.routes";

const studentAreaRouter = Router();

studentAreaRouter.use("/attendance", attendanceRouter);
studentAreaRouter.use("/marks", marksRouter);
studentAreaRouter.use("/results", resultRouter);
studentAreaRouter.use("/fees", feeRouter);
studentAreaRouter.use("/books", bookRouter);

export default studentAreaRouter;
