"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        const roles = req.auth?.roles ?? [];
        const hasRole = roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            res.status(httpStatus_1.HTTP_STATUS.FORBIDDEN).json(apiResponse_1.default.buildResponse({
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
const requirePermission = (permissionCode) => {
    return async (req, res, next) => {
        const userId = req.auth?.userId;
        if (!userId) {
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.default.buildResponse({
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
            res.status(httpStatus_1.HTTP_STATUS.FORBIDDEN).json(apiResponse_1.default.buildResponse({
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
const rbacMiddleware = {
    requireRoles,
    requirePermission,
};
exports.default = rbacMiddleware;
//# sourceMappingURL=rbac.middleware.js.map