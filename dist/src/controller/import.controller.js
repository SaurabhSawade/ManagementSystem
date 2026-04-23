"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportExcelController = exports.importExcelController = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const import_service_1 = require("../service/import.service");
exports.importExcelController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json((0, apiResponse_1.buildResponse)({
            status: httpStatus_1.HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: "Excel file is required",
            type: "VALIDATION_ERROR",
            data: null,
        }));
        return;
    }
    const summary = await (0, import_service_1.importExcelData)({
        actorId: req.auth.userId,
        fileName: req.file.originalname,
        buffer: req.file.buffer,
    });
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.IMPORT_DONE,
        type: "SUCCESS",
        data: summary,
    }));
});
exports.exportExcelController = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const buffer = await (0, import_service_1.exportExcelData)();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=college-export.xlsx");
    res.status(httpStatus_1.HTTP_STATUS.OK).send(buffer);
});
//# sourceMappingURL=import.controller.js.map