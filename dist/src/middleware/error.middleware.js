"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const appError_1 = require("../utils/appError");
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof appError_1.AppError) {
        res.status(error.status).json((0, apiResponse_1.buildResponse)({
            status: error.status,
            success: false,
            message: error.message,
            type: error.type,
        }));
        return;
    }
    logger_1.logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
    res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
        success: false,
        message: messages_1.MESSAGES.SERVER_ERROR,
        type: "SERVER_ERROR",
    }));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map