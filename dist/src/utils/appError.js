"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    status;
    type;
    constructor(status, message, type) {
        super(message);
        this.status = status;
        this.type = type;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=appError.js.map