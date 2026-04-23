"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const prisma_1 = require("../config/prisma");
const httpStatus_1 = require("../constants/httpStatus");
const messages_1 = require("../constants/messages");
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json((0, apiResponse_1.buildResponse)({
            status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
            success: false,
            message: messages_1.MESSAGES.UNAUTHORIZED,
            type: "AUTH_ERROR",
        }));
        return;
    }
    const token = authHeader.slice(7);
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const blacklisted = await prisma_1.prisma.tokenBlacklist.findUnique({
            where: { jti: payload.jti },
        });
        if (blacklisted) {
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json((0, apiResponse_1.buildResponse)({
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
            res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json((0, apiResponse_1.buildResponse)({
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
        res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json((0, apiResponse_1.buildResponse)({
            status: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
            success: false,
            message: messages_1.MESSAGES.UNAUTHORIZED,
            type: "AUTH_ERROR",
        }));
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.middleware.js.map