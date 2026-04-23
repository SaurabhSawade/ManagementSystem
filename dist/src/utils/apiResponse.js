"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildResponse = (params) => {
    return {
        status: params.status,
        success: params.success,
        message: params.message,
        type: params.type,
        data: params.data ?? null,
    };
};
const apiResponse = {
    buildResponse,
};
exports.default = apiResponse;
//# sourceMappingURL=apiResponse.js.map