import { ProjectConfig } from "../types/types.js";
import { readTemplateFile } from "../utils/utils.js";

export type TemplaterKey = "base" | "express" | "drizzle" | "prisma" | "mongoose";
export type TemplaterFunctionType = (options: ProjectConfig) => Promise<string>;

export interface ITemplateConfig {
    name: string;
    templater: Record<string, TemplaterFunctionType>;
}

export const TemplaterMap: Record<TemplaterKey, ITemplateConfig> = {
    // base templaters
    base: {
        name: "base",
        templater: {
            env: (options) => readTemplateFile("base/.env.ejs", options),
            gitignore: (options) => readTemplateFile("base/.gitignore.ejs", options),
            tsconfig: (options) => readTemplateFile("base/tsconfig.json.ejs", options),
            readme: (options) => readTemplateFile("base/README.md.ejs", options),
            indexEjs: (options) => readTemplateFile("base/index.ejs", options),
            envTs: (options) => readTemplateFile("base/env.ts.ejs", options)
        }
    },

    // framework specific templaters
    express: {
        name: "express",
        templater: {
            appTs: (options) => readTemplateFile("frameworks/express/app.ts.ejs", options),
            serverTs: (options) => readTemplateFile("frameworks/express/server.ts.ejs", options),
            routerTs: (options) => readTemplateFile("frameworks/express/router.ts.ejs", options),
            userRoutesTs: (options) =>
                readTemplateFile("frameworks/express/user.routes.ts.ejs", options),
            userControllerTs: (options) =>
                readTemplateFile("frameworks/express/user.controller.ts.ejs", options),
            errorMiddlewareTs: (options) =>
                readTemplateFile("frameworks/express/error.middleware.ts.ejs", options),
            loggerTs: (options) => readTemplateFile("frameworks/express/logger.ts.ejs", options)
        }
    },

    // orm specific templaters
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
