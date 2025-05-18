import path from "node:path";
import fs from "node:fs/promises";
import { intro, outro, log, spinner } from "@clack/prompts";

import { initGit } from "./init-git.js";
import { ProjectConfig } from "../types/types.js";
import { createPackageJson } from "./create-package-json.js";
import { installDependencies } from "./install-dependencies.js";
import { createProjectStructure } from "./create-project-structure.js";
import { showPostCreationInstructions } from "./post-creation-instructions.js";
import { checkDirExists, packageManagerConfig, packgeManageFromUserAgent } from "../utils/utils.js";
import { PackageManagerEnum } from "../enums/enums.js";

export async function createProject(options: ProjectConfig): Promise<void> {
    const startTime = Date.now();
    const { projectName, installDependencies: shouldInstallDeps, initializeGit, database, orm } = options;
    
    const cwd = process.cwd();
    const root = path.join(cwd, projectName);

    intro(`Creating ${projectName}...`);
    const pkgInfo = packgeManageFromUserAgent(process.env.npm_config_user_agent);
    const pmCommands = packageManagerConfig(pkgInfo?.name || "npm");

    try {
        // Validate project directory
        if (await checkDirExists(root)) {
            log.error(`Directory "${projectName}" already exists. Please choose a different project name.`);
            process.exit(0);
        }

        // Create project structure
        const s = spinner();
        s.start("Creating project files...");
        await fs.mkdir(root, { recursive: true });
        await createProjectStructure(options, { root, pkgManager: pkgInfo?.name || "npm", pkgLock: pmCommands.files.packageLockJson });
        s.stop("Project structure created");

        // Create package.json
        s.start("Creating package.json...");
        await createPackageJson(options, { root, pkgManager: pkgInfo?.name || "npm" });
        s.stop("Package.json created");

        // Install dependencies if requested
        if (shouldInstallDeps) {
            s.start("Installing dependencies...");
            await installDependencies(root, (pkgInfo?.name || "npm") as PackageManagerEnum, s);
            s.stop("Dependencies installed");
        }

        // Initialize git if requested
        if (initializeGit) {
            s.start("Initializing git...");
            await initGit(root);
            s.stop("Git initialized");
        }

        const duration = Math.round((Date.now() - startTime) / 1000);

        // Show post-creation instructions
        showPostCreationInstructions({
            projectPath: root,
            packageManager: (pkgInfo?.name || "npm") as PackageManagerEnum,
            installDependencies: shouldInstallDeps,
            orm,
        });

        outro("Project setup completed! Happy coding!");
    } catch (error: any) {
        log.error("An error occurred during project setup.");
        log.error(error.message);
        process.exit(1);
    }
}
