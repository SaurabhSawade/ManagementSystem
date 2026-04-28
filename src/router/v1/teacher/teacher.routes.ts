import { Router } from "express";
import attendanceRouter from "../attendance.routes";
import classroomRouter from "../classroom.routes";
import examRouter from "../exam.routes";
import marksRouter from "../marks.routes";
import resultRouter from "../result.routes";
import studentRouter from "../student.routes";
import subjectRouter from "../subject.routes";

const teacherAreaRouter = Router();

teacherAreaRouter.use("/students", studentRouter);
teacherAreaRouter.use("/classrooms", classroomRouter);
teacherAreaRouter.use("/subjects", subjectRouter);
teacherAreaRouter.use("/attendance", attendanceRouter);
teacherAreaRouter.use("/marks", marksRouter);
teacherAreaRouter.use("/exams", examRouter);
teacherAreaRouter.use("/results", resultRouter);

export default teacherAreaRouter;
