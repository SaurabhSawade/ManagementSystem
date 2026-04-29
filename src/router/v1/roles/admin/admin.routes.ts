import { Router } from "express";
import attendanceRouter from "../../resources/attendance/attendance.routes";
import auditRouter from "../../resources/audit/audit.routes";
import bookRouter from "../../resources/book/book.routes";
import classroomRouter from "../../resources/classroom/classroom.routes";
import examRouter from "../../resources/exam/exam.routes";
import feeRouter from "../../resources/fee/fee.routes";
import importRouter from "../../resources/import/import.routes";
import marksRouter from "../../resources/marks/marks.routes";
import resultRouter from "../../resources/result/result.routes";
import studentRouter from "../../resources/student/student.routes";
import subjectRouter from "../../resources/subject/subject.routes";
import teacherRouter from "../../resources/teacher/teacher.routes";
import userRouter from "../../resources/user/user.routes";

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
