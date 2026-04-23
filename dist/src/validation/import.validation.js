"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const importQuerySchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
});
const importValidation = {
    importQuerySchema,
};
exports.default = importValidation;
//# sourceMappingURL=import.validation.js.map