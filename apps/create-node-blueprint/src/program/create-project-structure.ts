import path from "node:path";
import { ProjectConfig } from "../types/types.js";
import { ensureDirExists, createFileWithContent } from "../utils/utils.js";
import { ITemplateConfig, TemplaterKey, TemplaterMap } from "../services/templater.js";
import { AuthEnum, FrameworkEnum, OrmEnum } from "../enums/enums.js";

interface ExtraConfig {
    root: string;
    pkgManager: string;
    pkgLock: string;
}

const nodeVersion = process.versions.node.split(".")[0];

// Main function to create the project files and folders and populate them with the correct content
export const createProjectStructure = async (config: ProjectConfig, { root, pkgManager, pkgLock }: ExtraConfig): Promise<void> => {
    try {
        // Ensure core DDD directories
        await ensureDirExists(path.resolve(root, "src"));
        await ensureDirExists(path.resolve(root, "src", "app", "config"));
        await ensureDirExists(path.resolve(root, "src", "app", "http"));
        if (config.framework === FrameworkEnum.express) {
            await ensureDirExists(path.resolve(root, "src", "app", "http", "middleware"));
        }
        await ensureDirExists(path.resolve(root, "src", "modules", "health"));
        await ensureDirExists(path.resolve(root, "src", "modules", "users"));

        // Infrastructure directories
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "database"));
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "cache"));
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "queue"));
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "storage"));
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "mail"));
        await ensureDirExists(path.resolve(root, "src", "infrastructure", "payments"));

        // Shared directories
        await ensureDirExists(path.resolve(root, "src", "shared", "errors"));
        await ensureDirExists(path.resolve(root, "src", "shared", "utils"));
        await ensureDirExists(path.resolve(root, "src", "shared", "types"));
        await ensureDirExists(path.resolve(root, "src", "shared", "constants"));

        // Tests directories
        await ensureDirExists(path.resolve(root, "tests", "unit"));
        await ensureDirExists(path.resolve(root, "tests", "integration"));
        await ensureDirExists(path.resolve(root, "tests", "e2e"));

        // 1. Root files
        await createFileAndInjectContent(root, "", ".env", "root", "env", config);
        await createFileAndInjectContent(root, "", "README.md", "root", "readme", config);
        await createFileAndInjectContent(root, "", ".gitignore", "root", "gitignore", config);
        await createFileAndInjectContent(root, "", "tsconfig.json", "root", "tsconfig", config);
        await createFileAndInjectContent(root, "", "biome.json", "root", "biome", config);
        await createFileAndInjectContent(root, "src", "index.ts", "root", "index", config);

        if (config.features.includes("docker")) {
            await createFileAndInjectContent(root, "", "Dockerfile", "root", "dockerfile", {
                pkgManager,
                nodeVersion,
                pkgLock
            });
            await createFileAndInjectContent(root, "", "docker-compose.yml", "root", "dockerComposeYml", {
                ...config,
                nodeVersion,
                pgVersion: "16",
                mysqlVersion: "8",
                mongoVersion: "7"
            });
            await createFileAndInjectContent(root, "", ".dockerignore", "root", "dockerignore", config);
        }

        // 2. App layer files
        await createFileAndInjectContent(root, "src/app/config", "env.ts", "app", "envConfig", config);
        await createFileAndInjectContent(root, "src/app", "routes.ts", "app", "routes", config);

        if (config.framework === FrameworkEnum.express) {
            await createFileAndInjectContent(root, "src/app/config", "cors.ts", "app", "corsConfig", config);
            await createFileAndInjectContent(root, "src/app/config", "logger.ts", "app", "loggerConfig", config);
            await createFileAndInjectContent(root, "src/app/http", "server.ts", "app", "server", config);
            await createFileAndInjectContent(root, "src/app/http", "app.ts", "app", "app", config);
            await createFileAndInjectContent(root, "src/app/http/middleware", "cors.middleware.ts", "app", "corsMiddleware", config);
            await createFileAndInjectContent(root, "src/app/http/middleware", "error.middleware.ts", "app", "errorMiddleware", config);
            await createFileAndInjectContent(root, "src/app/http/middleware", "helmet.middleware.ts", "app", "helmetMiddleware", config);
        } else if (config.framework === FrameworkEnum.fastify) {
            await createFileAndInjectContent(root, "src/app/config", "cors.ts", "app", "corsConfig", config);
            await createFileAndInjectContent(root, "src/app/http", "server.ts", "app", "server", config);
            await createFileAndInjectContent(root, "src/app/http", "app.ts", "app", "app", config);
        }

        // 3. Modules layer files
        await createFileAndInjectContent(root, "src/modules/health", "health.routes.ts", "modules", "healthRoutes", config);
        await createFileAndInjectContent(root, "src/modules/health", "health.controller.ts", "modules", "healthController", config);
        await createFileAndInjectContent(root, "src/modules/users", "user.routes.ts", "modules", "userRoutes", config);
        await createFileAndInjectContent(root, "src/modules/users", "user.controller.ts", "modules", "userController", config);
        await createFileAndInjectContent(root, "src/modules/users", "user.repo.ts", "modules", "userRepo", config);
        await createFileAndInjectContent(root, "src/modules/users", "user.types.ts", "modules", "userTypes", config);

        if (config.auth === AuthEnum.jwt) {
            await ensureDirExists(path.resolve(root, "src", "modules", "auth"));
            await createFileAndInjectContent(root, "src/modules/auth", "auth.routes.ts", "modules", "authRoutes", config);
            await createFileAndInjectContent(root, "src/modules/auth", "auth.controller.ts", "modules", "authController", config);
            await createFileAndInjectContent(root, "src/modules/auth", "auth.service.ts", "modules", "authService", config);
            await createFileAndInjectContent(root, "src/modules/auth", "auth.schema.ts", "modules", "authSchema", config);
            await createFileAndInjectContent(root, "src/modules/auth", "auth.types.ts", "modules", "authTypes", config);
        }

        // 4. Infrastructure layer files
        if (config.orm === OrmEnum.drizzle) {
            await ensureDirExists(path.resolve(root, "src", "infrastructure", "database", "schema"));
            await createFileAndInjectContent(root, "", "drizzle.config.ts", "infrastructure", "drizzleConfig", config);
            await createFileAndInjectContent(root, "src/infrastructure/database", "index.ts", "infrastructure", "drizzleIndex", config);
            await createFileAndInjectContent(root, "src/infrastructure/database", "schema.ts", "infrastructure", "drizzleSchema", config);
            await createFileAndInjectContent(root, "src/infrastructure/database/schema", "user.schema.ts", "infrastructure", "drizzleUserSchema", config);
            await createFileAndInjectContent(root, "src/infrastructure/database", "seed.ts", "infrastructure", "drizzleSeed", config);
            if (config.auth === AuthEnum.jwt) {
                await createFileAndInjectContent(root, "src/infrastructure/database/schema", "token.schema.ts", "infrastructure", "drizzleTokenSchema", config);
            }
        }

        if (config.orm === OrmEnum.prisma) {
            await ensureDirExists(path.resolve(root, "prisma"));
            await createFileAndInjectContent(root, "src/infrastructure/database", "index.ts", "infrastructure", "prismaClient", config);
            await createFileAndInjectContent(root, "prisma", "schema.prisma", "infrastructure", "prismaSchema", config);
            await createFileAndInjectContent(root, "prisma", "seed.ts", "infrastructure", "prismaSeed", config);
        }

        if (config.orm === OrmEnum.mongoose) {
            await ensureDirExists(path.resolve(root, "src", "infrastructure", "database", "models"));
            await createFileAndInjectContent(root, "src/infrastructure/database", "index.ts", "infrastructure", "mongooseConnection", config);
            await createFileAndInjectContent(root, "src/infrastructure/database/models", "user.model.ts", "infrastructure", "mongooseUserModel", config);
            await createFileAndInjectContent(root, "src/infrastructure/database", "seed.ts", "infrastructure", "mongooseSeed", config);
            if (config.auth === AuthEnum.jwt) {
                await createFileAndInjectContent(root, "src/infrastructure/database/models", "token.model.ts", "infrastructure", "mongooseTokenModel", config);
            }
        }

        // Stubs
        await createFileAndInjectContent(root, "src/infrastructure/cache", "index.ts", "infrastructure", "cacheIndex", config);
        await createFileAndInjectContent(root, "src/infrastructure/queue", "index.ts", "infrastructure", "queueIndex", config);
        await createFileAndInjectContent(root, "src/infrastructure/storage", "index.ts", "infrastructure", "storageIndex", config);
        await createFileAndInjectContent(root, "src/infrastructure/mail", "index.ts", "infrastructure", "mailIndex", config);
        await createFileAndInjectContent(root, "src/infrastructure/payments", "index.ts", "infrastructure", "paymentsIndex", config);

        // 5. Shared layer files
        await createFileAndInjectContent(root, "src/shared/errors", "app-error.ts", "shared", "appError", config);
        await createFileAndInjectContent(root, "src/shared/errors", "error-codes.ts", "shared", "errorCodes", config);
        await createFileAndInjectContent(root, "src/shared/utils", "pagination.ts", "shared", "pagination", config);
        await createFileAndInjectContent(root, "src/shared/utils", "dates.ts", "shared", "dates", config);
        await createFileAndInjectContent(root, "src/shared/types", "common.ts", "shared", "commonTypes", config);
        await createFileAndInjectContent(root, "src/shared/constants", "roles.ts", "shared", "rolesConstant", config);
        await createFileAndInjectContent(root, "src/shared/constants", "index.ts", "shared", "constants", config);

        if (config.auth === AuthEnum.jwt) {
            await createFileAndInjectContent(root, "src/shared/constants", "tokens.ts", "shared", "tokensConstant", config);
        }

        // 6. Test gitkeeps
        await createFileWithContent(path.resolve(root, "tests", "unit", ".gitkeep"), "");
        await createFileWithContent(path.resolve(root, "tests", "integration", ".gitkeep"), "");
        await createFileWithContent(path.resolve(root, "tests", "e2e", ".gitkeep"), "");
    } catch (err: any) {
        console.error("\nAn error occurred while creating project files:", err);
        process.exit(1);
    }
};

// Create file with content
const createFileAndInjectContent = async (
    projectPath: string,
    pathToCreate: string,
    fileToCreate: string,
    type: TemplaterKey,
    fileMethodKey: keyof ITemplateConfig["templater"],
    config: ProjectConfig | Record<string, any>
): Promise<void> => {
    try {
        const templateFunction = TemplaterMap[type]?.templater[fileMethodKey];
        if (!templateFunction) {
            throw new Error(`Template function for ${String(fileMethodKey)} is not found in ${type}`);
        }

        const fullPath = path.resolve(projectPath, pathToCreate, fileToCreate);
        const content = await templateFunction(config);
        await createFileWithContent(fullPath, content);
    } catch (error) {
        console.error(`Error creating ${fileToCreate}:`, error);
        throw error;
    }
};
