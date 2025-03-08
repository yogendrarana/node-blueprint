import app from "./app.js";
import dotenv from "dotenv";
import http from "node:http";
import path from "node:path";
import logger from "./config/logger.js";

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Create server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const startServer = async () => {

    server.listen(PORT, () => {
        logger.info(`🚀 HTTP Server running on port ${PORT}`);
    });
};

// Handle graceful shutdown
const shutdown = () => {
    server.close(() => {
        logger.info("Shutting down server...");
        process.exit(0);
    });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start the server
startServer();
