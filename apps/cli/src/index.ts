#!/usr/bin/env node

import minimist from "minimist";
import { CommandType } from "./enums/enums.js";
import { createProject } from "./program/createProject.js";
import { getProjectConfig } from "./program/promptUser.js";

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

    if (argv["_"][0] === CommandType.create) {
        if (argv.name && argv.framework && argv.database && argv.orm) {
            const config = {
                projectName: argv.name,
                framework: argv.framework,
                database: argv.database,
                orm: argv.orm
            };
            console.log(config);
            await createProject(config);
        } else {
            const answers = await getProjectConfig();
            await createProject(answers);
        }
    } else {
        console.log("Unknown command. Use 'create' to initialize a new project.");
    }
}

init().catch((e) => {
    console.log(e);
});
