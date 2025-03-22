import path from "node:path";
import { promises as fs } from "fs";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { ProjectConfig } from "../types/types.js";
import { packageManagerCommands } from "../utils/utils.js";

const execAsync = promisify(exec);

export async function createPackageJson(config: ProjectConfig, { root, pkgManager }: { root: string; pkgManager: string }): Promise<void> {
    try {
        const packageJsonPath = path.join(root, "package.json");

        const defaultPackageJson = {
            name: config.projectName,
            version: "1.0.0",
            description: "",
            main: "dist/server.js",
            scripts: {},
            keywords: [],
            author: "",
            license: "ISC"
        };
        await fs.writeFile(packageJsonPath, JSON.stringify(defaultPackageJson, null, 2));

        // Now proceed with modifications
        await modifyPackageJson(root, config);
        await installDependencies(root, config, pkgManager);
    } catch (error: any) {
        console.error(`Error message: ${error.message}\n`);
        process.exit(1);
    }
}

async function installDependencies(root: string, config: ProjectConfig, pkgManager: string) {
    const pkgManagerCommands = packageManagerCommands(pkgManager || "npm");

    const dependencies = [
        "cookie-parser",
        "dotenv",
        "ejs",
        "zod",
        ...(config.framework === "express" ? ["express", "winston", "winston-daily-rotate-file"] : []),
        ...(config.database === "postgres" ? ["pg"] : []),
        ...(config.database === "mysql" ? ["mysql2"] : []),
        ...(config.orm === "prisma" ? ["@prisma/client"] : []),
        ...(config.orm === "drizzle" ? ["drizzle-orm"] : []),
        ...(config.orm === "mongoose" ? ["mongoose"] : []),
        ...(config.features.includes("auth") ? ["jsonwebtoken", "bcrypt"] : [])
    ];

    const devDependencies = [
        "@types/cookie-parser",
        "@types/node",
        "tsx",
        "typescript",
        ...(config.database === "postgres" ? ["@types/pg"] : []),
        ...(config.framework === "express" ? ["@types/express"] : []),
        ...(config.orm === "mongoose" ? ["@types/mongoose"] : []),
        ...(config.orm === "drizzle" ? ["drizzle-kit"] : []),
        ...(config.orm === "prisma" ? ["prisma"] : []),
        ...(config.features.includes("auth") ? ["@types/bcrypt", "@types/jsonwebtoken"] : [])
    ];

    try {
        // Install dependencies
        if (dependencies.length > 0) {
            await execAsync(`${pkgManagerCommands.add} ${dependencies.join(" ")}`, { cwd: root });
        }

        // Install dev dependencies
        if (devDependencies.length > 0) {
            await execAsync(`${pkgManagerCommands.addDev} ${devDependencies.join(" ")}`, { cwd: root });
        }
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);
    }
}

async function modifyPackageJson(root: string, config: ProjectConfig) {
    const packageJsonPath = path.join(root, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    // Base configuration
    Object.assign(packageJson, {
        name: config.projectName,
        type: "module",
        main: "dist/server.js",
        scripts: {
            ...packageJson.scripts,
            build: "npx tsc",
            start: "node dist/server.js",
            dev: "tsx watch src/server.ts",
            ...(config.orm === "prisma" && getPrismaScripts()),
            ...(config.orm === "drizzle" && getDrizzleScripts()),
            ...(config.orm === "mongoose" && getMongooseScripts())
        }
    });

    // Write modified package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Special handling for ORMs
    if (config.orm === "prisma") {
        await execAsync("npx prisma generate", { cwd: root });
    }
}

// Helper functions for ORM scripts
function getPrismaScripts() {
    return {
        "db:seed": "tsx prisma/seed.ts",
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:migrate": "prisma migrate dev",
        "db:reset": "prisma migrate reset",
        "db:introspect": "prisma db pull",
        "db:deploy": "prisma migrate deploy",
        "db:studio": "prisma studio --port 4000"
    };
}

function getDrizzleScripts() {
    return {
        "db:seed": "tsx drizzle/seed.ts",
        "db:generate": "drizzle-kit generate",
        "db:push": "drizzle-kit push",
        "db:migrate": "tsx drizzle/migrate.ts",
        "db:drop-migration": "drizzle-kit drop",
        "db:introspect": "drizzle-kit introspect",
        "db:studio": "drizzle-kit studio --port 4000"
    };
}

function getMongooseScripts() {
    return {
        "db:seed": "tsx src/models/seed.ts"
    };
}
