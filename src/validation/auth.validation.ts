import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  }),
});

export const forgotPasswordRequestSchema = z.object({
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

export const verifyOtpAndResetSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    otp: z.string().length(6),
    newPassword: z.string().min(6),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20),
  }),
});
