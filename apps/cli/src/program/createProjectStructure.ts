import path from "node:path";
import { ProjectConfig } from "../types/types.js";
import { IOrmConfig, OrmMap } from "../maps/orm-map.js";
import { BaseMap, IBaseConfig } from "../maps/base-map.js";
import { FrameworkMap, IFrameworkConfig } from "../maps/framework-map.js";
import { ensureDirExists, createFileWithContent } from "../utils/utils.js";

// main function to create the project files and folders and populates the files with the correct content
export const createProjectStructure = async (
    config: ProjectConfig,
    { root }: { root: string }
): Promise<void> => {
    try {
        // create base files like package.json, tsconfig.json, .env, .gitignore, etc
        createFileAndInjectContent(root, "", ".env", "env", config);
        createFileAndInjectContent(root, "", "README.md", "readme", config);
        createFileAndInjectContent(root, "", ".gitignore", "gitignore", config);
        createFileAndInjectContent(root, "", "tsconfig.json", "tsconfig", config);
        // createFileAndInjectContent(root, "", "package.json", "packageJson", config);

        // create src and files inside it like app.ts, server.ts, router.ts
        await ensureDirExists(path.resolve(root, "src"));
        createFileAndInjectContent(root, "src", "app.ts", "appTs", config);
        createFileAndInjectContent(root, "src", "server.ts", "serverTs", config);
        createFileAndInjectContent(root, "src", "router.ts", "routerTs", config);

        // create views: src/views
        await ensureDirExists(path.resolve(root, "src", "views"));
        createFileAndInjectContent(root, "src/views", "index.ejs", "indexEjs", config);

        // create routes: src/routes
        await ensureDirExists(path.resolve(root, "src", "routes"));
        createFileAndInjectContent(root, "src/routes", "user.routes.ts", "userRoutesTs", config);

        // create conrollers: src/controllers
        await ensureDirExists(path.resolve(root, "src", "controllers"));
        createFileAndInjectContent(
            root,
            "src/controllers",
            "user.controller.ts",
            "userControllerTs",
            config
        );

        // creae scripts: scripts
        await ensureDirExists(path.resolve(root, "scripts"));

        // create models: src/constants
        await ensureDirExists(path.resolve(root, "src", "constants"));

        // create config: src/config
        await ensureDirExists(path.resolve(root, "src", "config"));

        // create src/services
        await ensureDirExists(path.resolve(root, "src", "services"));

        // create src/middlewares
        await ensureDirExists(path.resolve(root, "src", "middlewares"));

        // create utils: src/utils
        await ensureDirExists(path.resolve(root, "src", "utils"));

        // create validations: src/validations
        await ensureDirExists(path.resolve(root, "src", "validations"));

        // framework specific files and folders
        if (config.framework === "express") {
            await createFileAndInjectContent(
                root,
                "src/middlewares",
                "error.middleware.ts",
                "errorMiddlewareTs",
                config
            );
            await createFileAndInjectContent(root, "src/config", "logger.ts", "loggerTs", config);
        }

        // orm specific files and folders
        if (config.orm === "drizzle") {
            await ensureDirExists(path.resolve(root, "drizzle", "schema"));
            await createFileAndInjectContent(
                root,
                "",
                "drizzle.config.ts",
                "drizzleConfig",
                config
            );
            await createFileAndInjectContent(root, "drizzle", "index.ts", "indexTs", config);
            await createFileAndInjectContent(root, "drizzle", "seed.ts", "seedTs", config);
            await createFileAndInjectContent(root, "drizzle", "schema.ts", "schemaTs", config);
            await createFileAndInjectContent(
                root,
                "drizzle/schema",
                "user.schema.ts",
                "userSchemaTs",
                config
            );
        }

        if (config.orm === "prisma") {
            await ensureDirExists(path.resolve(root, "prisma"));
            await createFileAndInjectContent(root, "prisma", "index.ts", "indexTs", config);
            await createFileAndInjectContent(root, "prisma", "seed.ts", "seedTs", config);
            await createFileAndInjectContent(
                root,
                "prisma",
                "schema.prisma",
                "schemaPrisma",
                config
            );
        }

        if (config.orm === "mongoose") {
            await ensureDirExists(path.resolve(root, "src", "models"));
            await createFileAndInjectContent(
                root,
                "src/models",
                "user.model.ts",
                "userModelTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "src/config",
                "db.config.ts",
                "dbConfigTs",
                config
            );
        }
    } catch (err: any) {
        console.log("\nAn error occurred while creating project files\n");
        process.exit(1);
    }
};

// create file with
const createFileAndInjectContent = async (
    projectPath: string,
    pathToCreate: string,
    fileName: string,
    fileMethod:
        | keyof IFrameworkConfig["templater"]
        | keyof IBaseConfig["templater"]
        | keyof IOrmConfig["templater"],
    config: ProjectConfig
): Promise<void> => {
    try {
        let templateFunction: (opt: ProjectConfig) => Promise<string>;
        const fullPath = path.resolve(projectPath, pathToCreate, fileName);

        switch (fileMethod) {
            // for base files
            case "packageJson":
            case "env":
            case "gitignore":
            case "tsconfig":
            case "readme":
            case "indexEjs":
                const possibleBaseTemplateFunction = BaseMap.base.templater[fileMethod];
                if (!possibleBaseTemplateFunction) {
                    throw new Error(`Template function for ${fileMethod} is undefined`);
                }
                templateFunction = possibleBaseTemplateFunction;
                break;

            // for framework files
            case "appTs":
            case "serverTs":
            case "routerTs":
            case "userRoutesTs":
            case "userControllerTs":
            case "errorMiddlewareTs":
            case "loggerTs":
                const possibleTemplateFunction =
                    FrameworkMap[config.framework].templater[fileMethod];
                if (!possibleTemplateFunction) {
                    throw new Error(`Template function for ${fileMethod} is undefined`);
                }
                templateFunction = possibleTemplateFunction;
                break;

            // for orm files
            case "indexTs":
            case "schemaTs":
            case "userSchemaTs":
            case "seedTs":
            case "drizzleConfig":
            case "schemaPrisma":
            case "dbConfigTs":
            case "userModelTs":
                const possibleOrmTemplateFunction = OrmMap[config.orm].templater[fileMethod];
                if (!possibleOrmTemplateFunction) {
                    throw new Error(`Template function for ${fileMethod} is undefined`);
                }
                templateFunction = possibleOrmTemplateFunction;
                break;

            default:
                console.log("\nInvalid file method\n");
                process.exit(1);
        }

        if (!templateFunction) {
            throw new Error(`\nNo template found for file method: ${fileMethod}\n`);
        }

        const fileContent = await templateFunction(config);
        await createFileWithContent(fullPath, fileContent);
    } catch (err: any) {
        console.log(`\n${err.message} || An error occurred while creating file: ${fileName}\n`);
        process.exit(1);
    }
};
