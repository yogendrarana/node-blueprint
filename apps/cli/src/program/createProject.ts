import path from "path";
import { ProjectConfig } from "../types/types.js";
import { getPackageManager } from "../utils/utils.js";
import { createMainFiles } from "./program.js";

export async function createProject(config: ProjectConfig): Promise<void> {
    const cwd = process.cwd();
    const root = path.join(process.cwd(), config.projectName);
    const pkgManager = getPackageManager()?.name || "npm";

    try {
        // this function creates the project files and folders
        await createMainFiles(config, { root });

        // post creation steps
        const cdProjectName = path.relative(cwd, root);
        console.log(`\nProject created. Now run:\n`);

        if (root !== cwd) {
            console.log(
                `- cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`
            );
        }

        switch (pkgManager) {
            case "yarn":
                console.log("- yarn");
                console.log("- yarn dev");
                break;
            default:
                console.log(`- ${pkgManager} install`);
                console.log(`- ${pkgManager} run dev`);
                break;
        }
    } catch (error: any) {
        console.error("An error occurred:", error);
        process.exit(1);
    }
}
