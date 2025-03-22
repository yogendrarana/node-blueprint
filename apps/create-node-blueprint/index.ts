#!/usr/bin/env node

import minimist from "minimist";
import { promptUser } from "./src/program/promptUser.js";
import { createProject } from "./src/program/createProject.js";

async function init() {
    const argv = minimist(process.argv.slice(2), {
        default: { framework: "", database: "", orm: "" },
        alias: {
            n: "name",
            f: "framework",
            d: "database",
            o: "orm"
        },
        string: ["name", "framework", "database", "orm"],
        unknown: (arg) => {
            if (arg.startsWith("-")) {
                console.error(`Unknown option: ${arg}`);
                process.exit(1);
            }

            return true;
        }
    });

    if (argv.name && argv.framework && argv.database && argv.orm) {
        const config = {
            projectName: argv.name,
            framework: argv.framework,
            database: argv.database,
            orm: argv.orm,
            features: []
        };
        await createProject(config);
    } else {
        const answers = await promptUser();
        await createProject(answers);
    }
}

init().catch((e) => {
    console.log(e);
});
