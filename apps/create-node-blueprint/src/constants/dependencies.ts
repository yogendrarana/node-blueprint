export const DEPENDENCIES = {
    // Core dependencies
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.5.0",
    "ejs": "^3.1.10",
    "zod": "^3.25.64",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",

    // Framework dependencies
    "express": "^5.1.0",
    "winston": "^3.17.0",
    "winston-daily-rotate-file": "^5.0.0",

    // Database dependencies
    "pg": "^8.16.0",
    "mysql2": "^3.14.1",
    "mongoose": "^8.15.2",

    // ORM dependencies
    "@prisma/client": "^6.9.0",
    "drizzle-orm": "^0.44.2",

    // Auth dependencies
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^6.0.0"
} as const;

export const DEV_DEPENDENCIES = {
    // TypeScript and build tools
    "@types/node": "^24.0.1",
    "typescript": "^5.8.3",
    "tsx": "^4.20.3",

    // Type definitions
    "@types/cookie-parser": "^1.4.9",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/pg": "^8.15.4",
    "@types/mongoose": "^5.11.97",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.9",

    // ORM tools
    "prisma": "^6.9.0",
    "drizzle-kit": "^0.31.1"
} as const; 