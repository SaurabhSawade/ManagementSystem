"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireRoles = void 0;
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const apiResponse_1 = require("../utils/apiResponse");
const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        const roles = req.auth?.roles ?? [];
        const hasRole = roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            res.status(httpStatus_1.HTTP_STATUS.FORBIDDEN).json((0, apiResponse_1.buildResponse)({
                status: httpStatus_1.HTTP_STATUS.FORBIDDEN,
                success: false,
                message: messages_1.MESSAGES.FORBIDDEN,
                type: "FORBIDDEN",
            }));
            return;
        }
        next();
    };
};
exports.requireRoles = requireRoles;
const requirePermission = (permissionCode) => {
    return async (req, res, next) => {
        const userId = req.auth?.userId;
        if (!userId) {
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json((0, apiResponse_1.buildResponse)({
                status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
                success: false,
                message: messages_1.MESSAGES.UNAUTHORIZED,
                type: "AUTH_ERROR",
            }));
            return;
        }
        const permission = await prisma_1.prisma.userRole.findFirst({
            where: {
                userId,
                role: {
                    permissions: {
                        some: {
                            permission: {
                                code: permissionCode,
                            },
                        },
                    },
                },
            },
        });
        if (!permission) {
            res.status(httpStatus_1.HTTP_STATUS.FORBIDDEN).json((0, apiResponse_1.buildResponse)({
                status: httpStatus_1.HTTP_STATUS.FORBIDDEN,
                success: false,
                message: messages_1.MESSAGES.FORBIDDEN,
                type: "FORBIDDEN",
            }));
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
//# sourceMappingURL=rbac.middleware.js.map