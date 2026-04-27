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
import adminRouter from "./v1/admin/admin.routes";
import studentAreaRouter from "./v1/student/student.routes";
import teacherAreaRouter from "./v1/teacher/teacher.routes";
import accountantAreaRouter from "./v1/accountant/accountant.routes";
import libraryAreaRouter from "./v1/library/library.routes";

const apiRouter = Router();

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

apiRouter.use("/admin", adminRouter);
apiRouter.use("/student", studentAreaRouter);
apiRouter.use("/teacher", teacherAreaRouter);
apiRouter.use("/accountant", accountantAreaRouter);
apiRouter.use("/library", libraryAreaRouter);

export default apiRouter;
