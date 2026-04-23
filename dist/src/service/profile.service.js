"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = void 0;
const prisma_1 = require("../config/prisma");
const appError_1 = require("../utils/appError");
const httpStatus_1 = require("../constants/httpStatus");
const getMyProfile = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            studentProfile: {
                include: {
                    classRoom: true,
                    attendance: {
                        include: { subject: true },
                        orderBy: { date: "desc" },
                        take: 30,
                    },
                    marks: {
                        include: { exam: true, subject: true },
                        orderBy: { createdAt: "desc" },
                        take: 50,
                    },
                    results: {
                        include: { exam: true },
                        orderBy: { createdAt: "desc" },
                        take: 20,
                    },
                },
            },
            teacherProfile: true,
            roles: {
                include: {
                    role: true,
                },
            },
        },
    });
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
exports.getMyProfile = getMyProfile;
//# sourceMappingURL=profile.service.js.map