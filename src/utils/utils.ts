import ejs from "ejs";
import path from "path";
import fs from "fs/promises";
import fsExtra from "fs-extra";
import { OrmEnum } from "../enums/enums.js";
import { ProjectConfig } from "../types/types.js";

// generate file mappings
export const generateFileMappings = (
    config: ProjectConfig
): { template: string; output: string }[] => {
    const files = [
        // common files
        { template: "common/.env.ejs", output: ".env" },
        { template: "common/.gitignore.ejs", output: ".gitignore" },
        { template: "common/package.json.ejs", output: "package.json" },
        { template: "common/tsconfig.json.ejs", output: "tsconfig.json" },

        // framework specific files
        {
            template: `framework/${config.framework.toLowerCase()}/server.ts.ejs`,
            output: "src/server.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/app.ts.ejs`,
            output: "src/app.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/router.ts.ejs`,
            output: "src/router.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/controllers/user.controller.ts.ejs`,
            output: "src/controllers/user.controller.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/routes/v1/user.routes.ts.ejs`,
            output: "src/routes/v1/user.routes.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/utils/path.ts.ejs`,
            output: "src/utils/path.ts"
        },
        {
            template: `framework/${config.framework.toLowerCase()}/middlewares/error.middleware.ts.ejs`,
            output: "src/middlewares/error.middleware.ts"
        }
    ];

    if (config.orm === OrmEnum.drizzle) {
        files.push(
            {
                template: `database/${config.database}/drizzle/schema.ts.ejs`,
                output: "src/db/schema.ts"
            },
            {
                template: `database/${config.database}/drizzle/index.ts.ejs`,
                output: "src/db/index.ts"
            },
            {
                template: `database/${config.database}/drizzle/schema/user.schema.ts.ejs`,
                output: "src/db/schema/user.schema.ts"
            },
            {
                template: `common/.drizzle.config.ts.ejs`,
                output: ".drizzle.config.ts"
            }
        );
    }

    if (config.orm === OrmEnum.prisma) {
        files.push(
            {
                template: `database/${config.database}/prisma/schema.prisma.ejs`,
                output: "prisma/schema.prisma"
            },
            {
                template: `database/${config.database}/prisma/client.ts.ejs`,
                output: "src/db/client.ts"
            }
        );
    }

    return files;
};

// create file from template
export const createFileFromTemplate = async (
    templatePath: string,
    outputPath: string,
    config: ProjectConfig
) => {
    await fsExtra.mkdirp(path.dirname(outputPath));
    const content = await fs.readFile(templatePath, "utf-8");
    const rendered = ejs.render(content, config);
    await fs.writeFile(outputPath, rendered);
};
