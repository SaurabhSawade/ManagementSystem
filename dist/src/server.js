"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prisma_1 = require("./config/prisma");
const startServer = async () => {
    await prisma_1.prisma.$connect();
    const server = app_1.default.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server running on port ${env_1.env.PORT}`);
    });
    const shutdown = async () => {
        logger_1.logger.info("Graceful shutdown started");
        server.close(async () => {
            await prisma_1.prisma.$disconnect();
            logger_1.logger.info("Server stopped");
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
};
startServer().catch((error) => {
    logger_1.logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
});
//# sourceMappingURL=server.js.map