import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  }),
});

const forgotPasswordRequestSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().min(10).optional(),
      channel: z.enum(["EMAIL", "SMS"]),
    })
    .refine((value) => value.email || value.phone, {
      message: "Either email or phone is required",
    }),
});

const verifyOtpAndResetSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    otp: z.string().length(6),
    newPassword: z.string().min(6),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20),
  }),
});

const authValidation = {
  loginSchema,
  forgotPasswordRequestSchema,
  verifyOtpAndResetSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};

export default authValidation;
