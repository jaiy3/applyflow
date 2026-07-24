import "dotenv/config";

import app from "./app.js";
import prisma from "./utils/prisma.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === "production"
  ? "0.0.0.0"
  : "127.0.0.1";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Connected to PostgreSQL successfully.");

    const server = app.listen(PORT, HOST, () => {
      console.log(`ApplyFlow API running on http://${HOST}:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Closing server...`);

      server.close(async () => {
        await prisma.$disconnect();

        console.log("Database connection closed.");
        console.log("Server closed successfully.");

        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Unable to start ApplyFlow:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();