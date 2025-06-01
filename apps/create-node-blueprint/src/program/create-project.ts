import pc from "picocolors";
import path from "node:path";
import fs from "node:fs/promises";
import { intro, outro, log, spinner } from "@clack/prompts";

import { initGit } from "./init-git.js";
import { ProjectConfig } from "../types/types.js";
import { PackageManagerEnum } from "../enums/enums.js";
import { createPackageJson } from "./create-package-json.js";
import { installPackages } from "./install-packages.js";
import { createProjectStructure } from "./create-project-structure.js";
import { showPostCreationInstructions } from "./post-creation-instructions.js";
import { checkDirExists, packageManagerConfig, packgeManageFromUserAgent } from "../utils/utils.js";

export async function createProject(options: ProjectConfig): Promise<void> {
    const { projectName, installDependencies, initializeGit, orm } = options;

    const cwd = process.cwd();
    const root = path.join(cwd, projectName);

    console.log(pc.yellow("\n\nCreating project...\n"));
    intro(`Creating "${pc.cyan(projectName)}"`);
    const pkgInfo = packgeManageFromUserAgent(process.env.npm_config_user_agent);
    const pkgManagerCommands = packageManagerConfig(pkgInfo?.name || "npm");

    try {
        // Validate project directory
        if (await checkDirExists(root)) {
            log.error(`Directory "${projectName}" already exists. Please choose a different project name.`);
            process.exit(0);

            // TODO: Add a prompt to ask if the user wants to overwrite the existing directory
        }

        // Create project structure
        const s = spinner();
        s.start("Creating project files...");
        await fs.mkdir(root, { recursive: true });
        await createProjectStructure(options, { root, pkgManager: pkgInfo?.name || "npm", pkgLock: pkgManagerCommands.files.packageLockJson });
        s.stop("Project structure created");

        // Create package.json
        s.start("Creating package.json...");
        await createPackageJson(options, { root, pkgManager: pkgInfo?.name || "npm" });
        s.stop("Package.json created");

        // Install dependencies if requested
        if (installDependencies) {
            s.start("Installing dependencies...");
            await installPackages(root, (pkgInfo?.name || "npm") as PackageManagerEnum, s, options);
            s.stop("Dependencies installed");
        }

        // Initialize git if requested
        if (initializeGit) {
            s.start("Initializing git...");
            await initGit(root);
            s.stop("Git initialized");
        }

        // Show post-creation instructions
        showPostCreationInstructions({
            projectPath: root,
            packageManager: (pkgInfo?.name || "npm") as PackageManagerEnum,
            installDependencies,
            orm
        });

        outro("Project setup completed! Happy coding!");
    } catch (error: any) {
        log.error("An error occurred during project setup.");
        log.error(error.message);
        process.exit(1);
    }
}
