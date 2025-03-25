import { ProjectConfig } from "../types/types.js";
import { input, select, checkbox } from "@inquirer/prompts";
import { FrameworkEnum, DatabaseEnum, OrmEnum } from "../enums/enums.js";

export async function promptUser(): Promise<ProjectConfig> {
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
                { value: DatabaseEnum.mysql, name: "MySQL" },
                { value: DatabaseEnum.mongodb, name: "MongoDB" }
            ]
        });

        // orm
        const orm = await select({
            message: "Choose an ORM",
            choices: [
                {
                    value: OrmEnum.prisma,
                    name: "Prisma",
                    disabled: database === DatabaseEnum.mongodb
                },
                {
                    value: OrmEnum.drizzle,
                    name: "Drizzle",
                    disabled: database === DatabaseEnum.mongodb
                },
                {
                    value: OrmEnum.mongoose,
                    name: "Mongoose",
                    disabled: database !== DatabaseEnum.mongodb
                }
            ]
        });

        // auth
        const features = await checkbox({
            message: "Select additional features",
            choices: [
                { name: "Include basic jwt authentication", value: "auth" },
                { name: "Include Docker setup", value: "docker" }
            ]
        });

        return { projectName, framework, database, orm, features };
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
