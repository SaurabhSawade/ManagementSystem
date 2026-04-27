import { Router } from "express";
import feeRouter from "../fee.routes";
import importRouter from "../import.routes";
import profileRouter from "../profile.routes";
import studentRouter from "../student.routes";

const accountantAreaRouter = Router();

accountantAreaRouter.use("/profile", profileRouter);
accountantAreaRouter.use("/students", studentRouter);
accountantAreaRouter.use("/fees", feeRouter);
accountantAreaRouter.use("/files", importRouter);

export default accountantAreaRouter;
