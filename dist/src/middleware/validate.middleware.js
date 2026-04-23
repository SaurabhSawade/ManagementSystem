"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({ body: req.body, params: req.params, query: req.query });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json((0, apiResponse_1.buildResponse)({
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
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map