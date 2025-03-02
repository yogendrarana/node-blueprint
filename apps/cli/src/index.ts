#!/usr/bin/env node

import minimist from "minimist";
import { CommandType } from "./enums/enums.js";
import { createProject } from "./program/createProject.js";
import { getProjectConfig } from "./program/promptUser.js";

async function init() {

    const argv = minimist(process.argv.slice(2), {
        default: { framework: "", database: "", orm: "", auth: false },
        alias: {
            n: "name",
            f: "framework",
            d: "database",
            o: "orm",
            a: "basic-auth"
        }
    });

    if (argv["_"][0] === CommandType.create) {
        if (argv.name && argv.framework && argv.database && argv.orm) {
            const config = {
                projectName: argv.name,
                framework: argv.framework,
                database: argv.database,
                orm: argv.orm,
                auth: argv["auth"]
            };
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
