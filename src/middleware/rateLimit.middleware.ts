import rateLimit from "express-rate-limit";

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

const otpRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const rateLimitMiddleware = {
  authRateLimit,
  otpRateLimit,
};

export default rateLimitMiddleware;
