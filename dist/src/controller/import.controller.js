"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const import_service_1 = __importDefault(require("../service/import.service"));
const importController = {
    importExcel: asyncHandler_1.default.asyncHandler(async (req, res) => {
        if (!req.file) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json(apiResponse_1.default.buildResponse({
                status: httpStatus_1.HTTP_STATUS.BAD_REQUEST,
                success: false,
                message: "Excel file is required",
                type: "VALIDATION_ERROR",
                data: null,
            }));
            return;
        }
        const summary = await import_service_1.default.importExcelData({
            actorId: req.auth.userId,
            fileName: req.file.originalname,
            buffer: req.file.buffer,
        });
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.IMPORT_DONE,
            type: "SUCCESS",
            data: summary,
        }));
    }),
    exportExcel: asyncHandler_1.default.asyncHandler(async (_req, res) => {
        const buffer = await import_service_1.default.exportExcelData();
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=college-export.xlsx");
        res.status(httpStatus_1.HTTP_STATUS.OK).send(buffer);
    }),
};
exports.default = importController;
//# sourceMappingURL=import.controller.js.map