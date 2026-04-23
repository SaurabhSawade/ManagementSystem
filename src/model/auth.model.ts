import type { OtpChannel, Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const authModel = {
  findUserByUsername: (username: string) =>
    prisma.user.findUnique({
      where: { username },
    }),

  findUserById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),

  findUserByContact: (orFilters: Prisma.UserWhereInput[]) =>
    prisma.user.findFirst({
      where: { OR: orFilters },
    }),

  getUserRoles: async (userId: string): Promise<string[]> => {
    const roles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return roles.map((r) => r.role.code);
  },

  findTokenBlacklistByJti: (jti: string) =>
    prisma.tokenBlacklist.findUnique({
      where: { jti },
    }),

  upsertTokenBlacklist: (data: {
    jti: string;
    tokenType: string;
    userId: string;
    expiresAt: Date;
  }) =>
    prisma.tokenBlacklist.upsert({
      where: { jti: data.jti },
      update: { expiresAt: data.expiresAt },
      create: data,
    }),

  createOtpVerification: (data: {
    userId: string;
    email: string | null;
    phone: string | null;
    channel: OtpChannel;
    codeHash: string;
    purpose: string;
    expiresAt: Date;
  }) =>
    prisma.otpVerification.create({
      data,
    }),

  findLatestOtp: (orFilters: Prisma.OtpVerificationWhereInput[]) =>
    prisma.otpVerification.findFirst({
      where: {
        OR: orFilters,
        purpose: "FORGOT_PASSWORD",
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    }),

  incrementOtpAttempts: (id: string, attempts: number) =>
    prisma.otpVerification.update({
      where: { id },
      data: { attempts },
    }),

  resetPasswordWithOtp: (params: {
    userId: string;
    otpRecordId: string;
    passwordHash: string;
  }) =>
    prisma.$transaction([
      prisma.user.update({
        where: { id: params.userId },
        data: { passwordHash: params.passwordHash },
      }),
      prisma.otpVerification.update({
        where: { id: params.otpRecordId },
        data: {
          isUsed: true,
          consumedAt: new Date(),
        },
      }),
      prisma.passwordResetRequest.create({
        data: {
          userId: params.userId,
          requestedBy: params.userId,
          method: "OTP",
          status: "COMPLETED",
        },
      }),
    ]),

  updateUserPassword: (userId: string, passwordHash: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
};

export default authModel;
