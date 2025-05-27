import pc from "picocolors";
import { spinner } from "@clack/prompts";

import { execAsync } from "../utils/exec-async.js";
import { PackageManagerEnum } from "../enums/enums.js";
import { packageManagerConfig } from "../utils/utils.js";

export async function installPackages(projectPath: string, packageManager: PackageManagerEnum, s: ReturnType<typeof spinner>): Promise<void> {
    try {
        const installCommand = packageManagerConfig(packageManager || "npm").commands.install;

        await execAsync(installCommand, { 
            cwd: projectPath, 
        });
    } catch (error: any) {
        s.stop(pc.red("Failed to install dependencies"));
        console.error(pc.red(`Error message: ${error.message}\n`));
        process.exit(0);
    }
} 