import ora from "ora";
import path from "node:path";
import fs from "node:fs/promises";
import { ProjectConfig } from "../types/types.js";
import { createPackageJson } from "./createPackageJson.js";
import { createProjectStructure } from "./createProjectStructure.js";
import { checkDirExists, packageManagerConfig, packgeManageFromUserAgent } from "../utils/utils.js";

export async function createProject(config: ProjectConfig): Promise<void> {
    const cwd = process.cwd();
    const root = path.join(cwd, config.projectName);

    const spinner = ora().start("\n");
    const pkgInfo = packgeManageFromUserAgent(process.env.npm_config_user_agent);

    try {
        // Validate project directory
        if (await checkDirExists(root)) {
            spinner.fail(`Directory "${config.projectName}" already exists.`);
            process.exit(1);
        }

        const pmCommands = packageManagerConfig(pkgInfo?.name || "npm");

        // Create project structure
        spinner.text = "Creating project files...";
        await fs.mkdir(root, { recursive: true });
        await createProjectStructure(config, { root, pkgManager: pkgInfo?.name || "npm", pkgLock: pmCommands.files.packageLockJson });

        // Then handle package.json creation and dependencies
        console.log("\n");
        spinner.text = "Installing dependencies...";
        // await createPackageJson(config, { root, pkgManager: pkgInfo?.name || "npm" });

        // Show success message
        spinner.succeed("Project setup completed!");

        // Post-install instructions
        const relativePath = path.relative(cwd, root);
        console.log("\nNext steps:");
        console.log(`➜ cd ${relativePath.includes(" ") ? `"${relativePath}"` : relativePath}`);
        console.log(`➜ ${pmCommands.commands.dev}`);
        console.log("\nHappy coding! 🚀\n");
    } catch (error: any) {
        spinner.fail("An error occurred during project setup.");
        console.error(error.message);
        process.exit(1);
    }
}
