import { Router } from "express";
import attendanceRouter from "../../resources/attendance/attendance.routes";
import classroomRouter from "../../resources/classroom/classroom.routes";
import examRouter from "../../resources/exam/exam.routes";
import marksRouter from "../../resources/marks/marks.routes";
import resultRouter from "../../resources/result/result.routes";
import studentRouter from "../../resources/student/student.routes";
import subjectRouter from "../../resources/subject/subject.routes";

const teacherAreaRouter = Router();

teacherAreaRouter.use("/students", studentRouter);
teacherAreaRouter.use("/classrooms", classroomRouter);
teacherAreaRouter.use("/subjects", subjectRouter);
teacherAreaRouter.use("/attendance", attendanceRouter);
teacherAreaRouter.use("/marks", marksRouter);
teacherAreaRouter.use("/exams", examRouter);
teacherAreaRouter.use("/results", resultRouter);

export default teacherAreaRouter;
