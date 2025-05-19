import path from "node:path";
import { ProjectConfig } from "../types/types.js";
import { ensureDirExists, createFileWithContent } from "../utils/utils.js";
import { ITemplateConfig, TemplaterKey, TemplaterMap } from "../services/templater.js";
import { AuthEnum } from "../enums/enums.js";

interface ExtraConfig {
    root: string;
    pkgManager: string;
    pkgLock: string;
}

const nodeVersion = process.versions.node.split(".")[0];

// main function to create the project files and folders and populates the files with the correct content
export const createProjectStructure = async (config: ProjectConfig, { root, pkgManager, pkgLock }: ExtraConfig): Promise<void> => {
    try {
        // ensure folders
        await ensureDirExists(path.resolve(root, "src"));
        await ensureDirExists(path.resolve(root, "scripts"));
        await ensureDirExists(path.resolve(root, "src", "types"));
        await ensureDirExists(path.resolve(root, "src", "views"));
        await ensureDirExists(path.resolve(root, "src", "utils"));
        await ensureDirExists(path.resolve(root, "src", "routes"));
        await ensureDirExists(path.resolve(root, "src", "config"));
        await ensureDirExists(path.resolve(root, "src", "services"));
        await ensureDirExists(path.resolve(root, "src", "constants"));
        await ensureDirExists(path.resolve(root, "src", "types/enums"));
        await ensureDirExists(path.resolve(root, "src", "types/interfaces"));
        await ensureDirExists(path.resolve(root, "src", "validations"));
        await ensureDirExists(path.resolve(root, "src", "middlewares"));
        await ensureDirExists(path.resolve(root, "src", "controllers"));

        // create base files
        await createFileAndInjectContent(root, "", ".env", "base", "env", config);
        await createFileAndInjectContent(root, "", "README.md", "base", "readme", config);
        await createFileAndInjectContent(root, "", ".gitignore", "base", "gitignore", config);
        await createFileAndInjectContent(root, "", "tsconfig.json", "base", "tsconfig", config);
        await createFileAndInjectContent(root, "src/config", "env.ts", "base", "envTs", config);
        await createFileAndInjectContent(root, "src/views", "index.ejs", "base", "indexEjs", config);
        if (config.features.includes("docker")) {
            await createFileAndInjectContent(root, "", "Dockerfile", "base", "dockerFile", {
                pkgManager,
                nodeVersion,
                pkgLock
            });
            await createFileAndInjectContent(root, "", "docker-compose.yml", "base", "dockerComposeYml", {
                ...config,
                nodeVersion,
                pgVersion: "16",
                mysqlVersion: "8",
                mongoVersion: "7"
            });
            await createFileAndInjectContent(root, "", ".dockerignore", "base", "dockerIgnore", config);
        }

        // create files common for all frameworks
        await createFileAndInjectContent(root, "src", "app.ts", "common", "appTs", config);
        await createFileAndInjectContent(root, "src", "server.ts", "common", "serverTs", config);
        await createFileAndInjectContent(root, "src", "router.ts", "common", "routerTs", config);
        await createFileAndInjectContent(root, "src/routes", "user-routes.ts", "common", "userRoutesTs", config);
        await createFileAndInjectContent(root, "src/controllers", "user-controller.ts", "common", "userControllerTs", config);
        await createFileAndInjectContent(root, "src/routes", "health-routes.ts", "common", "healthRoutesTs", config);
        await createFileAndInjectContent(root, "src/controllers", "health-controller.ts", "common", "healthControllerTs", config);
        await createFileAndInjectContent(root, "src/types/enums", "role-enum.ts", "common", "roleEnumTs", config);
        if (config.auth === AuthEnum.jwtAuth) {
            await createFileAndInjectContent(root, "src/routes", "auth-routes.ts", "common", "authRoutesTs", config);
            await createFileAndInjectContent(root, "src/validations", "user-validations.ts", "common", "userValidationsTs", config);
            await createFileAndInjectContent(root, "src/services", "auth-services.ts", "common", "authServicesTs", config);
            if (config.orm !== "prisma") {
                await createFileAndInjectContent(root, "src/types/enums", "token-enum.ts", "common", "tokenEnumTs", config);
            }
        }

        // express framework specific files
        if (config.framework === "express") {
            await createFileAndInjectContent(root, "src/middlewares", "error-middleware.ts", "express", "errorMiddlewareTs", config);
            await createFileAndInjectContent(root, "src/config", "logger.ts", "express", "loggerTs", config);
            if (config.auth === AuthEnum.jwtAuth) {
                await createFileAndInjectContent(root, "src/utils", "error-handler.ts", "express", "errorHandlerTs", config);
            }
        }

        // drizzle orm specific files and folders
        if (config.orm === "drizzle") {
            await ensureDirExists(path.resolve(root, "drizzle", "schema"));
            await createFileAndInjectContent(root, "", "drizzle.config.ts", "drizzle", "drizzleConfig", config);
            await createFileAndInjectContent(root, "drizzle", "index.ts", "drizzle", "indexTs", config);
            await createFileAndInjectContent(root, "drizzle", "seed.ts", "drizzle", "seedTs", config);
            await createFileAndInjectContent(root, "drizzle", "schema.ts", "drizzle", "schemaTs", config);
            await createFileAndInjectContent(root, "drizzle/schema", "user-schema.ts", "drizzle", "userSchemaTs", config);
            if (config.auth === AuthEnum.jwtAuth) {
                await createFileAndInjectContent(root, "src/controllers", "auth-controller.ts", "drizzle", "authControllerTs", config);
                await createFileAndInjectContent(root, "drizzle/schema", "token-schema.ts", "drizzle", "tokenSchemaTs", config);
            }
        }

        // prisma orm specific files and folders
        if (config.orm === "prisma") {
            await ensureDirExists(path.resolve(root, "prisma"));
            await createFileAndInjectContent(root, "prisma", "prisma-client.ts", "prisma", "prismaClientTs", config);
            await createFileAndInjectContent(root, "prisma", "seed.ts", "prisma", "seedTs", config);
            await createFileAndInjectContent(root, "prisma", "schema.prisma", "prisma", "schemaPrisma", config);

            if (config.auth === AuthEnum.jwtAuth) {
                await createFileAndInjectContent(root, "src/controllers", "auth-controller.ts", "prisma", "authControllerTs", config);
            }
        }

        // mongoose orm specific files and folders
        if (config.orm === "mongoose") {
            await ensureDirExists(path.resolve(root, "src", "models"));
            await createFileAndInjectContent(root, "src/models", "user-model.ts", "mongoose", "userModelTs", config);
            await createFileAndInjectContent(root, "src/config", "db.ts", "mongoose", "dbTs", config);
            await createFileAndInjectContent(root, "src/models", "seed.ts", "mongoose", "seedTs", config);
            if (config.auth === AuthEnum.jwtAuth) {
                await createFileAndInjectContent(root, "src/models", "token-model.ts", "mongoose", "tokenModelTs", config);
                await createFileAndInjectContent(root, "src/controllers", "auth-controller.ts", "mongoose", "authControllerTs", config);
            }
        }
    } catch (err: any) {
        console.log("\nAn error occurred while creating project files:\n");
        process.exit(1);
    }
};

// create file with content
const createFileAndInjectContent = async (
    projectPath: string,
    pathToCreate: string,
    fileToCreate: string,
    type: TemplaterKey,
    fileMethodKey: keyof ITemplateConfig["templater"],
    config: ProjectConfig | Record<string, any>
): Promise<void> => {
    try {
        // Retrieve the correct templater function
        const templateFunction = TemplaterMap[type]?.templater[fileMethodKey];
        if (!templateFunction) {
            throw new Error(`Template function for ${fileMethodKey} is not found in ${type}`);
        }

        const fullPath = path.resolve(projectPath, pathToCreate, fileToCreate);
        const content = await templateFunction(config);
        await createFileWithContent(fullPath, content);
    } catch (error) {
        console.error(`Error creating ${fileToCreate}:`, error);
    }
};
