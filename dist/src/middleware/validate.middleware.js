"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const httpStatus_1 = require("../constants/httpStatus");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({ body: req.body, params: req.params, query: req.query });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json(apiResponse_1.default.buildResponse({
                status: httpStatus_1.HTTP_STATUS.BAD_REQUEST,
                success: false,
                message: "Validation failed",
                type: "VALIDATION_ERROR",
                data: error.flatten(),
            }));
            return;
        }
        next(error);
    }
};
const validateMiddleware = {
    validate,
};
exports.default = validateMiddleware;
//# sourceMappingURL=validate.middleware.js.map