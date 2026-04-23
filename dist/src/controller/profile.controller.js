"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfileController = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const profile_service_1 = require("../service/profile.service");
exports.getMyProfileController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const profile = await (0, profile_service_1.getMyProfile)(req.auth.userId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, apiResponse_1.buildResponse)({
        status: httpStatus_1.HTTP_STATUS.OK,
        success: true,
        message: messages_1.MESSAGES.PROFILE_FETCHED,
        type: "SUCCESS",
        data: profile,
    }));
});
//# sourceMappingURL=profile.controller.js.map