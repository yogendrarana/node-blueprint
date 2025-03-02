import { ProjectConfig } from "../types/types.js";
import { input, select } from "@inquirer/prompts";
import { FrameworkEnum, DatabaseEnum, OrmEnum } from "../enums/enums.js";

export async function getProjectConfig(): Promise<ProjectConfig> {
    try {
        // project name
        const projectName = await input({
            message: "What is your project name?",
            default: "node-blueprint-starter",
            validate: (value) => {
                if (!/^[a-z0-9-]+$/.test(value)) {
                    return "Project name can only contain lowercase letters, numbers, and hyphens";
                }

                return true;
            }
        });

        // framework
        const framework = await select({
            message: "Choose a framework",
            choices: [{ name: "Express", value: FrameworkEnum.express }]
        });

        // database
        const database = await select({
            message: "Choose a database",
            choices: [
                { value: DatabaseEnum.postgres, name: "PostgreSQL" },
                { value: DatabaseEnum.mysql, name: "MySQL" }
            ]
        });

        // orm
        const orm = await select({
            message: "Choose an ORM",
            choices: [
                { value: OrmEnum.prisma, name: "Prisma" },
                { value: OrmEnum.drizzle, name: "Drizzle" }
            ]
        });

        return { projectName, framework, database, orm };
    } catch (error: any) {
        if (error.message?.includes("ExitPromptError") || error?.name === "ExitPromptError") {
            console.log("\nPrompt cancelled. Goodbye!");
            process.exit(0);
        } else {
            console.error("An error occurred:", error);
        }

        return process.exit(1);
    }
}
