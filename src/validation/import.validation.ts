import { z } from "zod";

export const importQuerySchema = z.object({
  body: z.object({}).optional(),
});
