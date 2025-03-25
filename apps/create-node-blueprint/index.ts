#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { promptUser } from "./src/program/promptUser.js";
import { createProject } from "./src/program/createProject.js";
import { DatabaseEnum, FrameworkEnum, OrmEnum } from "./src/enums/enums.js";

async function init() {
    const argv = await yargs(hideBin(process.argv))
        .option("name", { alias: "n", type: "string", description: "Project name", default: "" })
        .option("framework", { alias: "f", type: "string", description: "Framework to use", default: "" })
        .option("database", { alias: "d", type: "string", description: "Database type", default: "" })
        .option("orm", { alias: "o", type: "string", description: "ORM to use", default: "" })
        .option("features", { type: "array", description: "Additional features to include", default: [] })
        .parse();

    const { name, framework, database, orm, features } = argv;

    if (name && framework && database && orm) {
        await createProject({
            projectName: name,
            framework: framework as FrameworkEnum,
            database: database as DatabaseEnum,
            orm: orm as OrmEnum,
            features: features as string[]
        });
    } else {
        const answers = await promptUser();
        await createProject(answers);
    }
}

init().catch((e) => {
    console.log(e);
});
