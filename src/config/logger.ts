import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.resolve(process.cwd(), "logs");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
});

const fileTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

export const logger = winston.createLogger({
  level: "info",
  transports: [consoleTransport, fileTransport],
  exceptionHandlers: [consoleTransport, fileTransport],
  rejectionHandlers: [consoleTransport, fileTransport],
});
