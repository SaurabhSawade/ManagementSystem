"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = void 0;
const buildResponse = (params) => {
    return {
        status: params.status,
        success: params.success,
        message: params.message,
        type: params.type,
        data: params.data ?? null,
    };
};
exports.buildResponse = buildResponse;
//# sourceMappingURL=apiResponse.js.map