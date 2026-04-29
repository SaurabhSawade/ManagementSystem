import { Router } from "express";
import authRouter from "./resources/auth/auth.routes";
import profileRouter from "./resources/profile/profile.routes";
import accountantAreaRouter from "./roles/accountant/accountant.routes";
import adminRouter from "./roles/admin/admin.routes";
import libraryAreaRouter from "./roles/library/library.routes";
import studentAreaRouter from "./roles/student/student.routes";
import teacherAreaRouter from "./roles/teacher/teacher.routes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/profile", profileRouter);

v1Router.use("/admin", adminRouter);
v1Router.use("/student", studentAreaRouter);
v1Router.use("/teacher", teacherAreaRouter);
v1Router.use("/accountant", accountantAreaRouter);
v1Router.use("/library", libraryAreaRouter);

export default v1Router;
