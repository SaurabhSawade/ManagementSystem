import { z } from "zod";

const importQuerySchema = z.object({
  body: z.object({}).optional(),
});

const importValidation = {
  importQuerySchema,
};

export default importValidation;
