import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import asyncUtils from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import importService from "../service/import.service";

const importController = {
  importExcel: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        apiResponse.buildResponse({
          status: HTTP_STATUS.BAD_REQUEST,
          success: false,
          message: "Excel file is required",
          type: "VALIDATION_ERROR",
          data: null,
        }),
      );
      return;
    }

    const summary = await importService.importExcelData({
      actorId: req.auth!.userId,
      fileName: req.file.originalname,
      buffer: req.file.buffer,
    });

    res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.IMPORT_DONE,
        type: "SUCCESS",
        data: summary,
      }),
    );
  }),

  exportExcel: asyncUtils.asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await importService.exportExcelData();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=college-export.xlsx");

    res.status(HTTP_STATUS.OK).send(buffer);
  }),
};

export default importController;
