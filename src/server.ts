import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import syncRbac from "./config/rbacSync";

const startServer = async () => {
	await prisma.$connect();
	await syncRbac();

	const server = app.listen(env.PORT, () => {
		logger.info(`Server running on port ${env.PORT}`);
	});

	const shutdown = async () => {
		logger.info("Graceful shutdown started");
		server.close(async () => {
			await prisma.$disconnect();
			logger.info("Server stopped");
			process.exit(0);
		});
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
	logger.error(error instanceof Error ? error.stack ?? error.message : String(error));
	process.exit(1);
});
