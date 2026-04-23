"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const node_path_1 = __importDefault(require("node:path"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const logDir = node_path_1.default.resolve(process.cwd(), "logs");
const consoleTransport = new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)),
});
const fileTransport = new winston_daily_rotate_file_1.default({
    dirname: logDir,
    filename: "application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    zippedArchive: true,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
});
exports.logger = winston_1.default.createLogger({
    level: "info",
    transports: [consoleTransport, fileTransport],
    exceptionHandlers: [consoleTransport, fileTransport],
    rejectionHandlers: [consoleTransport, fileTransport],
});
//# sourceMappingURL=logger.js.map