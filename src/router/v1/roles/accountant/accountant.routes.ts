import { Router } from "express";
import feeRouter from "../../resources/fee/fee.routes";
import importRouter from "../../resources/import/import.routes";
import studentRouter from "../../resources/student/student.routes";

const accountantAreaRouter = Router();

accountantAreaRouter.use("/students", studentRouter);
accountantAreaRouter.use("/fees", feeRouter);
accountantAreaRouter.use("/files", importRouter);

export default accountantAreaRouter;
