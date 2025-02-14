import path from "path";
import fs from "fs/promises";
import { ProjectConfig } from "../types/types.js";
import { createFileFromTemplate, generateFileMappings } from "../utils/utils.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(config: ProjectConfig): Promise<void> {
    try {
        // create project directory
        const projectPath = path.join(process.cwd(), config.projectName);
        await fs.mkdir(projectPath, { recursive: true });

        // generate file mappings
        const files = generateFileMappings(config);

        // process each template file
        for (const file of files) {
            const templatePath = path.join(__dirname, "..", "templates", file.template);
            const outputPath = path.join(projectPath, file.output);

            // create
            createFileFromTemplate(templatePath, outputPath, config);
        }
    } catch (error: any) {}
}
