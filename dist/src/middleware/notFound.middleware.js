"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const notFoundHandler = (_req, res) => {
    res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json(apiResponse_1.default.buildResponse({
        status: httpStatus_1.HTTP_STATUS.NOT_FOUND,
        success: false,
        message: "Route not found",
        type: "NOT_FOUND",
    }));
};
const notFoundMiddleware = {
    notFoundHandler,
};
exports.default = notFoundMiddleware;
//# sourceMappingURL=notFound.middleware.js.map