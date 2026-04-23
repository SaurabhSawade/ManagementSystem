"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const profile_service_1 = __importDefault(require("../service/profile.service"));
const profileController = {
    getMyProfile: asyncHandler_1.default.asyncHandler(async (req, res) => {
        const profile = await profile_service_1.default.getMyProfile(req.auth.userId);
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.OK,
            success: true,
            message: messages_1.MESSAGES.PROFILE_FETCHED,
            type: "SUCCESS",
            data: profile,
        }));
    }),
};
exports.default = profileController;
//# sourceMappingURL=profile.controller.js.map