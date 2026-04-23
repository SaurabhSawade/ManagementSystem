"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const notFoundHandler = (_req, res) => {
    res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.NOT_FOUND,
        success: false,
        message: "Route not found",
        type: "NOT_FOUND",
    }));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.middleware.js.map