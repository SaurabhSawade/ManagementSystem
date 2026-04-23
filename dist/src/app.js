"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const router_1 = __importDefault(require("./router"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const apiResponse_1 = require("./utils/apiResponse");
const httpStatus_1 = require("./constants/httpStatus");
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(node_path_1.default.resolve(process.cwd(), "docs/openapi.yaml"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get("/health", (_req, res) => {
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: "Server is healthy",
        type: "SUCCESS",
        data: { uptime: process.uptime() },
    }));
});
app.use("/api/v1", router_1.default);
app.use(notFound_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map