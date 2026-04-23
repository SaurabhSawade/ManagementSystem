"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importQuerySchema = void 0;
const zod_1 = require("zod");
exports.importQuerySchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
});
//# sourceMappingURL=import.validation.js.map