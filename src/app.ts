import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import apiRouter from "./router";
import errorMiddleware from "./middleware/error.middleware";
import notFoundMiddleware from "./middleware/notFound.middleware";
import apiResponse from "./utils/apiResponse";
import { HTTP_STATUS } from "./constants/httpStatus";

const app = express();
const swaggerDocument = YAML.load(path.resolve(process.cwd(), "docs/openapi.yaml"));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => {
	res.status(HTTP_STATUS.OK).json(
		apiResponse.buildResponse({
			status: HTTP_STATUS.OK,
			success: true,
			message: "Server is healthy",
			type: "SUCCESS",
			data: { uptime: process.uptime() },
		}),
	);
});

app.use("/api/v1", apiRouter);

app.use(notFoundMiddleware.notFoundHandler);
app.use(errorMiddleware.errorHandler);

export default app;
