import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const getConnectionString = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode");

  if (sslMode && ["prefer", "require", "verify-ca"].includes(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
};

const adapter = new PrismaPg({ connectionString: getConnectionString() });
const prisma = new PrismaClient({ adapter });

export { prisma };
