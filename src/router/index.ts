import { Router } from "express";
import authRouter from "./v1/auth.routes";
import userRouter from "./v1/user.routes";
import profileRouter from "./v1/profile.routes";
import importRouter from "./v1/import.routes";
import studentRouter from "./v1/student.routes";
import teacherRouter from "./v1/teacher.routes";
import classroomRouter from "./v1/classroom.routes";
import subjectRouter from "./v1/subject.routes";
import attendanceRouter from "./v1/attendance.routes";
import marksRouter from "./v1/marks.routes";
import examRouter from "./v1/exam.routes";
import resultRouter from "./v1/result.routes";
import feeRouter from "./v1/fee.routes";
import bookRouter from "./v1/book.routes";
import auditRouter from "./v1/audit.routes";

const apiRouter = Router();
const adminRouter = Router();
const studentAreaRouter = Router();
const teacherAreaRouter = Router();
const accountantAreaRouter = Router();
const libraryAreaRouter = Router();

// Authentication & User Management
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/profile", profileRouter);

// Academic Management
apiRouter.use("/students", studentRouter);
apiRouter.use("/teachers", teacherRouter);
apiRouter.use("/classrooms", classroomRouter);
apiRouter.use("/subjects", subjectRouter);
apiRouter.use("/attendance", attendanceRouter);
apiRouter.use("/marks", marksRouter);
apiRouter.use("/exams", examRouter);
apiRouter.use("/results", resultRouter);

// Administrative
apiRouter.use("/fees", feeRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/audit", auditRouter);

// Data Operations
apiRouter.use("/files", importRouter);

// Role-based route namespaces
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

studentAreaRouter.use("/profile", profileRouter);
studentAreaRouter.use("/attendance", attendanceRouter);
studentAreaRouter.use("/marks", marksRouter);
studentAreaRouter.use("/results", resultRouter);
studentAreaRouter.use("/fees", feeRouter);
studentAreaRouter.use("/books", bookRouter);

teacherAreaRouter.use("/profile", profileRouter);
teacherAreaRouter.use("/students", studentRouter);
teacherAreaRouter.use("/classrooms", classroomRouter);
teacherAreaRouter.use("/subjects", subjectRouter);
teacherAreaRouter.use("/attendance", attendanceRouter);
teacherAreaRouter.use("/marks", marksRouter);
teacherAreaRouter.use("/exams", examRouter);
teacherAreaRouter.use("/results", resultRouter);

accountantAreaRouter.use("/profile", profileRouter);
accountantAreaRouter.use("/students", studentRouter);
accountantAreaRouter.use("/fees", feeRouter);
accountantAreaRouter.use("/files", importRouter);

libraryAreaRouter.use("/profile", profileRouter);
libraryAreaRouter.use("/books", bookRouter);

apiRouter.use("/admin", adminRouter);
apiRouter.use("/student", studentAreaRouter);
apiRouter.use("/teacher", teacherAreaRouter);
apiRouter.use("/accountant", accountantAreaRouter);
apiRouter.use("/library", libraryAreaRouter);

export default apiRouter;
