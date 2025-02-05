import { input, select, confirm } from "@inquirer/prompts";
import { DatabaseEnum, FrameworkEnum, OrmEnum } from "./enums.js";

export interface AnswerType {
    projectName: string;
    framework: FrameworkEnum;
    database: DatabaseEnum;
    orm: OrmEnum;
    auth: boolean;
}

export async function askAllQuestions(): Promise<AnswerType> {
    try {
        // project name
        const projectName = await input({ message: "What is your project name?" });

        // framework
        const framework = await select({
            message: "What framework do you want to use?",
            choices: [
                { value: FrameworkEnum.express, name: "Express" },
                { value: FrameworkEnum.fastify, name: "Fastify" }
            ]
        });

        // database
        const database = await select({
            message: "What database do you want to use?",
            choices: [
                { value: DatabaseEnum.mysql, name: "MySQL" },
                { value: DatabaseEnum.postgres, name: "PostgreSQL" }
            ]
        });

        // orm
        const orm = await select({
            message: "What ORM do you want to use?",
            choices: [
                { value: OrmEnum.prisma, name: "Prisma" },
                { value: OrmEnum.drizzle, name: "Drizzle" }
            ]
        });

        // auth
        const auth = await confirm({
            message: "Do you want basic auth (access and refresh token) setup?",
            default: false
        });

        return { projectName, framework, database, orm, auth };
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
