import crypto from "node:crypto";

export const generateOtp = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
