import { getOrm } from "./get-orm.js";
import { getDatabase } from "./get-database.js";
import { getFeatures } from "./get-features.js";
import { getFramework } from "./get-framework.js";
import { ProjectConfig } from "../types/types.js";
import { getProjectName } from "./get-project-name.js";
import { getInitializeGit } from "./get-initialize-git.js";
import { getInstallDependencies } from "./get-install-deps.js";
import { getAuth } from "./get-auth.js";

export async function prompt(): Promise<ProjectConfig> {
    try {
        const projectName = await getProjectName();
        const framework = await getFramework();
        const database = await getDatabase();
        const orm = await getOrm(database as any);
        const auth = await getAuth();
        const features = await getFeatures();
        const initializeGit = await getInitializeGit();
        const installDeps = await getInstallDependencies();

        return {
            projectName: projectName as string,
            framework: framework as any,
            database: database as any,
            orm: orm as any,
            auth: auth as any,
            features: features as string[],
            installDependencies: installDeps as boolean,
            initializeGit: initializeGit as boolean
        };
    } catch (error: any) {
        if (error.message?.includes("ExitPromptError") || error?.name === "ExitPromptError") {
            console.log("\nPrompt cancelled. Goodbye!");
            process.exit(0);
        } else {
            console.error("An error occurred:", error.message);
        }

        return process.exit(1);
    }
} 