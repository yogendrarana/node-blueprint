export const DEPENDENCIES = {
    // Core dependencies
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.9",
    "zod": "^3.22.4",

    // Framework dependencies
    "express": "^4.18.2",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",

    // Database dependencies
    "pg": "^8.11.3",
    "mysql2": "^3.6.5",
    "mongoose": "^8.0.3",

    // ORM dependencies
    "@prisma/client": "^5.7.1",
    "drizzle-orm": "^0.29.3",

    // Auth dependencies
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1"
} as const;

export const DEV_DEPENDENCIES = {
    // TypeScript and build tools
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",

    // Type definitions
    "@types/cookie-parser": "^1.4.6",
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.9",
    "@types/mongoose": "^5.11.97",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",

    // ORM tools
    "prisma": "^5.7.1",
    "drizzle-kit": "^0.20.14"
} as const; 