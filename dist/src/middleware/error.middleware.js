"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const appError_1 = require("../utils/appError");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof appError_1.AppError) {
        res.status(error.status).json(apiResponse_1.default.buildResponse({
            status: error.status,
            success: false,
            message: error.message,
            type: error.type,
        }));
        return;
    }
    logger_1.logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
    res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse_1.default.buildResponse({
        status: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
        success: false,
        message: messages_1.MESSAGES.SERVER_ERROR,
        type: "SERVER_ERROR",
    }));
};
const errorMiddleware = {
    errorHandler,
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map