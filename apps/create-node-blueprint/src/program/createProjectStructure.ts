import path from "node:path";
import { ProjectConfig } from "../types/types.js";
import { ensureDirExists, createFileWithContent } from "../utils/utils.js";
import { ITemplateConfig, TemplaterKey, TemplaterMap } from "../services/templater.js";

// main function to create the project files and folders and populates the files with the correct content
export const createProjectStructure = async (
    config: ProjectConfig,
    { root }: { root: string }
): Promise<void> => {
    try {
        // ensure folders
        await ensureDirExists(path.resolve(root, "src"));
        await ensureDirExists(path.resolve(root, "scripts"));
        await ensureDirExists(path.resolve(root, "src", "views"));
        await ensureDirExists(path.resolve(root, "src", "utils"));
        await ensureDirExists(path.resolve(root, "src", "routes"));
        await ensureDirExists(path.resolve(root, "src", "config"));
        await ensureDirExists(path.resolve(root, "src", "services"));
        await ensureDirExists(path.resolve(root, "src", "constants"));
        await ensureDirExists(path.resolve(root, "src", "validations"));
        await ensureDirExists(path.resolve(root, "src", "middlewares"));
        await ensureDirExists(path.resolve(root, "src", "controllers"));

        // create base files
        createFileAndInjectContent(root, "", ".env", "base", "env", config);
        createFileAndInjectContent(root, "", "README.md", "base", "readme", config);
        createFileAndInjectContent(root, "", ".gitignore", "base", "gitignore", config);
        createFileAndInjectContent(root, "", "tsconfig.json", "base", "tsconfig", config);
        await createFileAndInjectContent(root, "src/config", "env.ts", "base", "envTs", config);
        createFileAndInjectContent(root, "src/views", "index.ejs", "base", "indexEjs", config);

        // create files common for all frameworks
        createFileAndInjectContent(root, "src", "app.ts", config.framework, "appTs", config);
        createFileAndInjectContent(root, "src", "server.ts", config.framework, "serverTs", config);
        createFileAndInjectContent(root, "src", "router.ts", config.framework, "routerTs", config);
        createFileAndInjectContent(
            root,
            "src/routes",
            "user.routes.ts",
            config.framework,
            "userRoutesTs",
            config
        );
        createFileAndInjectContent(
            root,
            "src/controllers",
            "user.controller.ts",
            config.framework,
            "userControllerTs",
            config
        );

        // express framework specific files
        if (config.framework === "express") {
            await createFileAndInjectContent(
                root,
                "src/middlewares",
                "error.middleware.ts",
                "express",
                "errorMiddlewareTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "src/config",
                "logger.ts",
                "express",
                "loggerTs",
                config
            );
        }

        // drizzle orm specific files and folders
        if (config.orm === "drizzle") {
            await ensureDirExists(path.resolve(root, "drizzle", "schema"));
            await createFileAndInjectContent(
                root,
                "",
                "drizzle.config.ts",
                "drizzle",
                "drizzleConfig",
                config
            );
            await createFileAndInjectContent(
                root,
                "drizzle",
                "index.ts",
                "drizzle",
                "indexTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "drizzle",
                "seed.ts",
                "drizzle",
                "seedTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "drizzle",
                "schema.ts",
                "drizzle",
                "schemaTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "drizzle/schema",
                "user.schema.ts",
                "drizzle",
                "userSchemaTs",
                config
            );
        }

        // prisma orm specific files and folders
        if (config.orm === "prisma") {
            await ensureDirExists(path.resolve(root, "prisma"));
            await createFileAndInjectContent(
                root,
                "prisma",
                "index.ts",
                "prisma",
                "indexTs",
                config
            );
            await createFileAndInjectContent(root, "prisma", "seed.ts", "prisma", "seedTs", config);
            await createFileAndInjectContent(
                root,
                "prisma",
                "schema.prisma",
                "prisma",
                "schemaPrisma",
                config
            );
        }

        // mongoose orm specific files and folders
        if (config.orm === "mongoose") {
            await ensureDirExists(path.resolve(root, "src", "models"));
            await createFileAndInjectContent(
                root,
                "src/models",
                "user.model.ts",
                "mongoose",
                "userModelTs",
                config
            );
            await createFileAndInjectContent(
                root,
                "src/config",
                "db.config.ts",
                "mongoose",
                "dbConfigTs",
                config
            );
        }
    } catch (err: any) {
        console.log("\nAn error occurred while creating project files\n");
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
    config: ProjectConfig
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

        console.log(`✅ Created ${fullPath}`);
    } catch (error) {
        console.error(`Error creating ${fileToCreate}:`, error);
    }
};
