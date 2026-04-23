"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_model_1 = __importDefault(require("../model/profile.model"));
const appError_1 = require("../utils/appError");
const httpStatus_1 = require("../constants/httpStatus");
const getMyProfile = async (userId) => {
    const user = await profile_model_1.default.findProfileByUserId(userId);
    if (!user) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
    }
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
        isActive: user.isActive,
        roles: user.roles.map((r) => r.role.code),
        studentProfile: user.studentProfile,
        teacherProfile: user.teacherProfile,
    };
};
const profileService = {
    getMyProfile,
};
exports.default = profileService;
//# sourceMappingURL=profile.service.js.map