import path from "node:path";
import { promises as fs } from "fs";

import { ProjectConfig } from "../types/types.js";
import { execAsync } from "../utils/exec-async.js";
import { packageManagerConfig } from "../utils/utils.js";
import { DEPENDENCIES, DEV_DEPENDENCIES } from "../constants/dependencies.js";

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
        await modifyPackageJson(root, config, pkgManager);
    } catch (error: any) {
        console.error(`Error message: ${error.message}\n`);
        process.exit(1);
    }
}

function getDependencies(config: ProjectConfig): { dependencies: Record<string, string>, devDependencies: Record<string, string> } {
    const dependencies: Record<string, string> = {
        "cookie-parser": DEPENDENCIES["cookie-parser"],
        "dotenv": DEPENDENCIES["dotenv"],
        "ejs": DEPENDENCIES["ejs"],
        "zod": DEPENDENCIES["zod"]
    };

    const devDependencies: Record<string, string> = {
        "@types/node": DEV_DEPENDENCIES["@types/node"],
        "typescript": DEV_DEPENDENCIES["typescript"],
        "tsx": DEV_DEPENDENCIES["tsx"],
        "@types/cookie-parser": DEV_DEPENDENCIES["@types/cookie-parser"]
    };

    // Add framework specific dependencies
    if (config.framework === "express") {
        dependencies["express"] = DEPENDENCIES["express"];
        dependencies["winston"] = DEPENDENCIES["winston"];
        dependencies["winston-daily-rotate-file"] = DEPENDENCIES["winston-daily-rotate-file"];
        devDependencies["@types/express"] = DEV_DEPENDENCIES["@types/express"];
    }

    // Add database specific dependencies
    if (config.database === "postgres") {
        dependencies["pg"] = DEPENDENCIES["pg"];
        devDependencies["@types/pg"] = DEV_DEPENDENCIES["@types/pg"];
    } else if (config.database === "mysql") {
        dependencies["mysql2"] = DEPENDENCIES["mysql2"];
    }

    // Add ORM specific dependencies
    if (config.orm === "prisma") {
        dependencies["@prisma/client"] = DEPENDENCIES["@prisma/client"];
        devDependencies["prisma"] = DEV_DEPENDENCIES["prisma"];
    } else if (config.orm === "drizzle") {
        dependencies["drizzle-orm"] = DEPENDENCIES["drizzle-orm"];
        devDependencies["drizzle-kit"] = DEV_DEPENDENCIES["drizzle-kit"];
    } else if (config.orm === "mongoose") {
        dependencies["mongoose"] = DEPENDENCIES["mongoose"];
        devDependencies["@types/mongoose"] = DEV_DEPENDENCIES["@types/mongoose"];
    }

    // Add jwt-auth dependencies if selected
    if (config.auth === "jwt-auth") {
        dependencies["jsonwebtoken"] = DEPENDENCIES["jsonwebtoken"];
        dependencies["bcrypt"] = DEPENDENCIES["bcrypt"];
        devDependencies["@types/bcrypt"] = DEV_DEPENDENCIES["@types/bcrypt"];
        devDependencies["@types/jsonwebtoken"] = DEV_DEPENDENCIES["@types/jsonwebtoken"];
    }

    return { dependencies, devDependencies };
}

async function modifyPackageJson(root: string, config: ProjectConfig, pkgManager: string) {
    const packageJsonPath = path.join(root, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    const { dependencies, devDependencies } = getDependencies(config);

    // Base configuration
    Object.assign(packageJson, {
        name: config.projectName,
        type: "module",
        main: "dist/server.js",
        dependencies,
        devDependencies,
        scripts: {
            ...packageJson.scripts,
            build: "npx tsc",
            start: "node dist/server.js",
            dev: "tsx watch src/server.ts",
            ...(config.orm === "prisma" && getPrismaScripts()),
            ...(config.orm === "drizzle" && getDrizzleScripts(pkgManager)),
            ...(config.orm === "mongoose" && getMongooseScripts())
        }
    });

    // Write modified package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
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

function getDrizzleScripts(pkgManager: string) {
    const pkgManagerCommands = packageManagerConfig(pkgManager || "npm").commands;

    return {
        "db:seed": "tsx drizzle/seed.ts",
        "db:generate": `${pkgManagerCommands.build} && drizzle-kit generate`,
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
