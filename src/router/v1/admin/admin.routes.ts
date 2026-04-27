import { Router } from "express";
import attendanceRouter from "../attendance.routes";
import auditRouter from "../audit.routes";
import bookRouter from "../book.routes";
import classroomRouter from "../classroom.routes";
import examRouter from "../exam.routes";
import feeRouter from "../fee.routes";
import importRouter from "../import.routes";
import marksRouter from "../marks.routes";
import resultRouter from "../result.routes";
import studentRouter from "../student.routes";
import subjectRouter from "../subject.routes";
import teacherRouter from "../teacher.routes";
import userRouter from "../user.routes";

const adminRouter = Router();

adminRouter.use("/users", userRouter);
adminRouter.use("/students", studentRouter);
adminRouter.use("/teachers", teacherRouter);
adminRouter.use("/classrooms", classroomRouter);
adminRouter.use("/subjects", subjectRouter);
adminRouter.use("/attendance", attendanceRouter);
adminRouter.use("/marks", marksRouter);
adminRouter.use("/exams", examRouter);
adminRouter.use("/results", resultRouter);
adminRouter.use("/fees", feeRouter);
adminRouter.use("/books", bookRouter);
adminRouter.use("/audit", auditRouter);
adminRouter.use("/files", importRouter);

export default adminRouter;
