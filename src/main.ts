#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";
import { CommandType } from "./enums/enums.js";
import { createProject } from "./program/createProject.js";
import { getProjectConfig } from "./program/promptUser.js";

async function main() {
    path.dirname(fileURLToPath(import.meta.url));

    const args = process.argv.slice(2);

    if (args[0] === CommandType.create) {
        const answers = await getProjectConfig();
        await createProject(answers);
    } else {
        console.log("Unknown command. Use 'create' to initialize a new project.");
    }
}

main();
