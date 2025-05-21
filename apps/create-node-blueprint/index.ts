#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { prompt } from "./src/prompts/prompts.js";
import { createProject } from "./src/program/create-project.js";
import { AuthEnum, DatabaseEnum, FrameworkEnum, OrmEnum } from "./src/enums/enums.js";

async function init() {
    const argv = await yargs(hideBin(process.argv))
        .scriptName("create-node-blueprint")
        .option("name", { alias: "n", type: "string", description: "Project name", default: "" })
        .option("framework", { alias: "f", type: "string", description: "Framework to use", default: "" })
        .option("database", { alias: "d", type: "string", description: "Database type", default: "" })
        .option("orm", { alias: "o", type: "string", description: "ORM to use", default: "" })
        .option("auth", { alias: "a", type: "string", description: "Authentication method", default: AuthEnum.none })
        .option("features", { type: "array", description: "Additional features to include", default: [] })
        .option("git", { type: "boolean", description: "Init git repository (use --no-git to skip)", default: true })
        .option("install", { type: "boolean", description: "Install packages (use --no-install to skip)", default: true })
        .demandOption(["name", "framework", "database", "orm"], "Please provide the required arguments.")
        .parse();

    const { name, framework, database, orm, features, git, install, auth } = argv;

    if (name && framework && database && orm) {
        await createProject({
            projectName: name,
            framework: framework as FrameworkEnum,
            database: database as DatabaseEnum,
            orm: orm as OrmEnum,
            features: features as string[],
            installDependencies: install !== false,
            initializeGit: git !== false,
            auth: (auth as AuthEnum) || AuthEnum.none
        });
    } else {
        const answers = await prompt();
        await createProject(answers);
    }
}

init().catch((e) => {
    console.log(e);
});
