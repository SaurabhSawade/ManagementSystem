import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import profileRouter from "./profile.routes";
import importRouter from "./import.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/files", importRouter);

export default apiRouter;
