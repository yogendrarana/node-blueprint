import path from "node:path";
import fs from "fs/promises";
import { ProjectConfig } from "../types/types.js";
import { IOrmConfig, OrmMap } from "../maps/orm-map.js";
import { BaseMap, IBaseConfig } from "../maps/base-map.js";
import { FrameworkMap, IFrameworkConfig } from "../maps/framework-map.js";
import { checkDirExists, ensureDirExists, createFileWithContent } from "../utils/utils.js";

// main function to create the project files and folders
// and populates the files with the correct content
export const createMainFiles = async (
    options: ProjectConfig,
    { root }: { root: string }
): Promise<void> => {
    try {
        // create new directory with the project name
        const rootExists = await checkDirExists(root);
        if (rootExists) {
            console.log("\nDirectory already exists. Please choose a different project name.\n");
            process.exit(1);
        }
        await fs.mkdir(root, { recursive: true });

        // create base files like package.json, tsconfig.json, .env, .gitignore, etc
        createFileAndInjectContent(root, "", ".env", "env", options);
        createFileAndInjectContent(root, "", "README.md", "readme", options);
        createFileAndInjectContent(root, "", ".gitignore", "gitignore", options);
        createFileAndInjectContent(root, "", "tsconfig.json", "tsconfig", options);
        createFileAndInjectContent(root, "", "package.json", "packageJson", options);

        // create src and files inside it like app.ts, server.ts, router.ts
        await ensureDirExists(path.resolve(root, "src"));
        createFileAndInjectContent(root, "src", "app.ts", "appTs", options);
        createFileAndInjectContent(root, "src", "server.ts", "serverTs", options);
        createFileAndInjectContent(root, "src", "router.ts", "routerTs", options);

        // create views: src/views
        await ensureDirExists(path.resolve(root, "src", "views"));
        createFileAndInjectContent(root, "src/views", "home.ejs", "indexEjs", options);

        // create routes: src/routes/v1
        await ensureDirExists(path.resolve(root, "src", "routes"));
        createFileAndInjectContent(root, "src/routes", "user.routes.ts", "userRoutesTs", options);

        // create conrollers: src/controllers
        await ensureDirExists(path.resolve(root, "src", "controllers"));
        createFileAndInjectContent(
            root,
            "src/controllers",
            "user.controller.ts",
            "userControllerTs",
            options
        );

        // creae scripts: scripts
        await ensureDirExists(path.resolve(root, "scripts"));

        // create models: src/constants
        await ensureDirExists(path.resolve(root, "src", "constants"));

        // create config: src/config
        await ensureDirExists(path.resolve(root, "src", "config"));
        
        // create src/middlewares
        await ensureDirExists(path.resolve(root, "src", "middlewares"));
        
        // create utils: src/utils
        await ensureDirExists(path.resolve(root, "src", "utils"));

        // create validations: src/validations
        await ensureDirExists(path.resolve(root, "src", "validations"));

        // framework specific files and folders
        if (options.framework === "express") {
            await createFileAndInjectContent(
                root,
                "src/middlewares",
                "error.middleware.ts",
                "errorMiddlewareTs",
                options
            );
        }

        // orm specific files and folders
        if (options.orm === "drizzle") {
            await ensureDirExists(path.resolve(root, "drizzle", "schema"));
            await createFileAndInjectContent(
                root,
                "",
                "drizzle.config.ts",
                "drizzleConfig",
                options
            );
            await createFileAndInjectContent(root, "drizzle", "index.ts", "indexTs", options);
            await createFileAndInjectContent(root, "drizzle", "seed.ts", "seedTs", options);
            await createFileAndInjectContent(root, "drizzle", "schema.ts", "schemaTs", options);
            await createFileAndInjectContent(
                root,
                "drizzle/schema",
                "user.schema.ts",
                "userSchemaTs",
                options
            );
        }

        if (options.orm === "prisma") {
            await ensureDirExists(path.resolve(root, "prisma"));
            await createFileAndInjectContent(root, "prisma", "index.ts", "indexTs", options);
            await createFileAndInjectContent(root, "prisma", "seed.ts", "seedTs", options);
            await createFileAndInjectContent(
                root,
                "prisma",
                "schema.prisma",
                "schemaPrisma",
                options
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
    options: ProjectConfig
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
                const possibleTemplateFunction =
                    FrameworkMap[options.framework].templater[fileMethod];
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
                const possibleOrmTemplateFunction = OrmMap[options.orm].templater[fileMethod];
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

        const fileContent = await templateFunction(options);
        await createFileWithContent(fullPath, fileContent);
    } catch (err: any) {
        console.log(`\n${err.message} || An error occurred while creating file: ${fileName}\n`);
        process.exit(1);
    }
};
