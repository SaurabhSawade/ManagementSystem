import { Router } from "express";
import authRouter from "./v1/auth.routes";
import userRouter from "./v1/user.routes";
import profileRouter from "./v1/profile.routes";
import importRouter from "./v1/import.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/files", importRouter);

export default apiRouter;
