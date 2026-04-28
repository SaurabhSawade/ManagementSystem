import { Router } from "express";
import feeRouter from "../fee.routes";
import importRouter from "../import.routes";
import studentRouter from "../student.routes";

const accountantAreaRouter = Router();

accountantAreaRouter.use("/students", studentRouter);
accountantAreaRouter.use("/fees", feeRouter);
accountantAreaRouter.use("/files", importRouter);

export default accountantAreaRouter;
