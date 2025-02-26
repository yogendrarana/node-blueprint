import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { ProjectConfig } from "../types/types.js";
import { copyDir, getPackageManager } from "../utils/utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(config: ProjectConfig): Promise<void> {
    const cwd = process.cwd();
    const root = path.join(process.cwd(), config.projectName);
    const pkgManager = getPackageManager()?.name || "npm";
    const templateDir = path.resolve(
        __dirname,
        "../../templates",
        `${config.framework}-${config.database}-${config.orm}`
    );

    try {
        // create project directory
        await fs.mkdir(root, { recursive: true });

        // copy template files
        const copy = async (src: string, dest: string) => {
            const stat = await fs.stat(src);
            if (stat.isDirectory()) {
                copyDir(src, dest);
            } else {
                await fs.copyFile(src, dest);
            }
        };

        // write file
        const write = async (file: string, content?: string) => {
            const targetPath = path.join(root, file);
            if (content) {
                await fs.writeFile(targetPath, content);
            } else {
                copy(path.join(templateDir, file), targetPath);
            }
        };

        const files = await fs.readdir(templateDir);
        for (const file of files.filter(
            (f) =>
                f !== "package.json" &&
                f !== "node_modules" &&
                f !== "migrations" &&
                !f.toLowerCase().includes("lock")
        )) {
            write(file);
        }

        const pkg = JSON.parse(await fs.readFile(path.join(templateDir, `package.json`), "utf-8"));

        pkg.name = config.projectName;

        write("package.json", JSON.stringify(pkg, null, 4) + "\n");

        // post creation steps
        const cdProjectName = path.relative(cwd, root);
        console.log(`\nProject created. Now run:\n`);

        if (root !== cwd) {
            console.log(
                `  cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`
            );
        }

        switch (pkgManager) {
            case "yarn":
                console.log("  yarn");
                console.log("  yarn dev");
                break;
            default:
                console.log(`  ${pkgManager} install`);
                console.log(`  ${pkgManager} run dev`);
                break;
        }
    } catch (error: any) {
        console.error("An error occurred:", error);
        process.exit(1);
    }
}
