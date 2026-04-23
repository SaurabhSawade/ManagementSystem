"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
const asyncUtils = {
    asyncHandler,
};
exports.default = asyncUtils;
//# sourceMappingURL=asyncHandler.js.map