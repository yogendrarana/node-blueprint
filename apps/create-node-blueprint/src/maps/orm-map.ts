import { readTemplateFile } from "../utils/utils.js";
import { TemplaterFunctionType } from "./framework-map.js";

type TOrmMap = Record<string, IOrmConfig>;

export interface IOrmConfig {
    name: string;
    templater: {
        indexTs?: TemplaterFunctionType;
        schemaTs?: TemplaterFunctionType;
        userSchemaTs?: TemplaterFunctionType;
        seedTs?: TemplaterFunctionType;
        schemaPrisma?: TemplaterFunctionType;
        drizzleConfig?: TemplaterFunctionType;
        userModelTs?: TemplaterFunctionType;
        dbConfigTs?: TemplaterFunctionType;
    };
}

// orm map
export const OrmMap: TOrmMap = {
    drizzle: {
        name: "drizzle",
        templater: {
            indexTs: (options) => readTemplateFile("orms/drizzle/index.ts.ejs", options),
            schemaTs: (options) => readTemplateFile("orms/drizzle/schema.ts.ejs", options),
            userSchemaTs: (options) => readTemplateFile("orms/drizzle/user.schema.ts.ejs", options),
            seedTs: (options) => readTemplateFile("orms/drizzle/seed.ts.ejs", options),
            drizzleConfig: (options) =>
                readTemplateFile("orms/drizzle/drizzle.config.ts.ejs", options)
        }
    },
    prisma: {
        name: "prisma",
        templater: {
            indexTs: (options) => readTemplateFile("orms/prisma/index.ts.ejs", options),
            schemaPrisma: (options) => readTemplateFile("orms/prisma/schema.prisma.ejs", options),
            seedTs: (options) => readTemplateFile("orms/prisma/seed.ts.ejs", options)
        }
    },
    mongoose: {
        name: "mongoose",
        templater: {
            userModelTs: (options) => readTemplateFile("orms/mongoose/user.model.ts.ejs", options),
            dbConfigTs: (options) => readTemplateFile("orms/mongoose/db.config.ts.ejs", options)
        }
    }
};
