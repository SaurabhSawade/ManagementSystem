import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    password: z.string().min(6),
    roles: z.array(z.string()).min(1),
  }),
});

const blockUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    reason: z.string().min(3),
  }),
});

const resetUserPasswordSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    newPassword: z.string().min(6),
  }),
});

const userValidation = {
  createUserSchema,
  blockUserSchema,
  resetUserPasswordSchema,
};

export default userValidation;
