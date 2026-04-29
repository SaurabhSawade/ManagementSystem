import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  }),
});

const otpChannelSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.toUpperCase() : value),
  z.enum(["EMAIL", "SMS"]).optional(),
);

const forgotPasswordRequestSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().min(10).optional(),
      channel: otpChannelSchema,
    })
    .superRefine((value, ctx) => {
      if (!value.email && !value.phone) {
        ctx.addIssue({
          code: "custom",
          message: "Either email or phone is required",
          path: ["email"],
        });
      }

      if (value.channel === "EMAIL" && !value.email) {
        ctx.addIssue({
          code: "custom",
          message: "Email is required when channel is EMAIL",
          path: ["email"],
        });
      }

      if (value.channel === "SMS" && !value.phone) {
        ctx.addIssue({
          code: "custom",
          message: "Phone is required when channel is SMS",
          path: ["phone"],
        });
      }
    })
    .transform((value) => {
      return {
        ...value,
        channel: value.channel ?? (value.email ? "EMAIL" : "SMS"),
      };
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
