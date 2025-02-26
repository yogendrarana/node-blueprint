import dotenv from "dotenv";
import http from "node:http";
import path from "node:path";
import { createExpressApp } from "./app.js";

// .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// create express app
const app = createExpressApp();

// create server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
