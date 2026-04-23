"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
            success: false,
            message: messages_1.MESSAGES.UNAUTHORIZED,
            type: "AUTH_ERROR",
        }));
        return;
    }
    const token = authHeader.slice(7);
    try {
        const payload = jwt_1.default.verifyAccessToken(token);
        const blacklisted = await prisma_1.prisma.tokenBlacklist.findUnique({
            where: { jti: payload.jti },
        });
        if (blacklisted) {
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.default.buildResponse({
                status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
                success: false,
                message: "Token is blacklisted",
                type: "AUTH_ERROR",
            }));
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user || !user.isActive || user.isBlocked) {
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.default.buildResponse({
                status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
                success: false,
                message: messages_1.MESSAGES.UNAUTHORIZED,
                type: "AUTH_ERROR",
            }));
            return;
        }
        req.auth = {
            userId: user.id,
            username: user.username,
            roles: user.roles.map((r) => r.role.code),
            jti: payload.jti,
            ...(user.email ? { email: user.email } : {}),
            ...(user.phone ? { phone: user.phone } : {}),
        };
        next();
    }
    catch {
        res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.default.buildResponse({
            status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
            success: false,
            message: messages_1.MESSAGES.UNAUTHORIZED,
            type: "AUTH_ERROR",
        }));
    }
};
const authMiddleware = {
    requireAuth,
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map