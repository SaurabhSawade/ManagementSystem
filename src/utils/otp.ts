import crypto from "node:crypto";

const generateOtp = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const otpUtils = {
  generateOtp,
  hashOtp,
};

export default otpUtils;
