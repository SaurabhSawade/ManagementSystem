import { Router } from "express";
import authRouter from "./v1/auth.routes";
import profileRouter from "./v1/profile.routes";
import adminRouter from "./v1/admin/admin.routes";
import studentAreaRouter from "./v1/student/student.routes";
import teacherAreaRouter from "./v1/teacher/teacher.routes";
import accountantAreaRouter from "./v1/accountant/accountant.routes";
import libraryAreaRouter from "./v1/library/library.routes";

const apiRouter = Router();

// Authentication & User Management
apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", profileRouter);

// Role-grouped APIs
apiRouter.use("/admin", adminRouter);
apiRouter.use("/student", studentAreaRouter);
apiRouter.use("/teacher", teacherAreaRouter);
apiRouter.use("/accountant", accountantAreaRouter);
apiRouter.use("/library", libraryAreaRouter);

export default apiRouter;
