import { ProjectConfig } from "../types/types.js";
import { readTemplateFile } from "../utils/utils.js";

export type TemplaterKey = "base" | "common" | "express" | "drizzle" | "prisma" | "mongoose";
export type TemplaterFunctionType = (options: ProjectConfig | Record<string, unknown>) => Promise<string>;

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
            envTs: (options) => readTemplateFile("base/env.ts.ejs", options),
            dockerFile: (options) => readTemplateFile("base/docker-file.ejs", options),
            dockerIgnore: (options) => readTemplateFile("base/.dockerignore.ejs", options),
            dockerComposeYml: (options) => readTemplateFile("base/docker-compose.yml.ejs", options)
        }
    },

    // common templaters
    common: {
        name: "common",
        templater: {
            serverTs: (options) => readTemplateFile("common/server.ts.ejs", options),
            appTs: (options) => readTemplateFile("common/app.ts.ejs", options),
            routerTs: (options) => readTemplateFile("common/router.ts.ejs", options),
            userRoutesTs: (options) => readTemplateFile("common/user-routes.ts.ejs", options),
            userControllerTs: (options) => readTemplateFile("common/user-controller.ts.ejs", options),
            authRoutesTs: (options) => readTemplateFile("common/auth-routes.ts.ejs", options),
            authControllerTs: (options) => readTemplateFile("common/auth-controller.ts.ejs", options),
            authValidationsTs: (options) => readTemplateFile("common/auth-validations.ts.ejs", options),
            authServicesTs: (options) => readTemplateFile("common/auth-services.ts.ejs", options),
            roleEnumTs: (options) => readTemplateFile("common/role-enum.ts.ejs", options),
            tokenEnumTs: (options) => readTemplateFile("common/token-enum.ts.ejs", options),
            dockerFile: (options) => readTemplateFile("common/docker-file.ejs", options),
            dockerComposeYml: (options) => readTemplateFile("common/docker-compose.yml.ejs", options),
            healthRoutesTs: (option) => readTemplateFile("common/health-routes.ts.ejs", option),
            healthControllerTs: (options) => readTemplateFile("common/health-controller.ts.ejs", options)
        }
    },

    // framework specific templaters
    express: {
        name: "express",
        templater: {
            errorMiddlewareTs: (options) => readTemplateFile("frameworks/express/error-middleware.ts.ejs", options),
            loggerTs: (options) => readTemplateFile("frameworks/express/logger.ts.ejs", options),
            errorHandlerTs: (options) => readTemplateFile("frameworks/express/error-handler.ts.ejs", options)
        }
    },

    // orm specific templaters
    drizzle: {
        name: "drizzle",
        templater: {
            indexTs: (options) => readTemplateFile("orms/drizzle/index.ts.ejs", options),
            schemaTs: (options) => readTemplateFile("orms/drizzle/schema.ts.ejs", options),
            userSchemaTs: (options) => readTemplateFile("orms/drizzle/user-schema.ts.ejs", options),
            tokenSchemaTs: (options) => readTemplateFile("orms/drizzle/token-schema.ts.ejs", options),
            seedTs: (options) => readTemplateFile("orms/drizzle/seed.ts.ejs", options),
            drizzleConfig: (options) => readTemplateFile("orms/drizzle/drizzle.config.ts.ejs", options),
            authControllerTs: (options) => readTemplateFile("orms/drizzle/auth-controller.ts.ejs", options)
        }
    },
    prisma: {
        name: "prisma",
        templater: {
            prismaClientTs: (options) => readTemplateFile("orms/prisma/prisma-client.ts.ejs", options),
            schemaPrisma: (options) => readTemplateFile("orms/prisma/schema.prisma.ejs", options),
            seedTs: (options) => readTemplateFile("orms/prisma/seed.ts.ejs", options),
            authControllerTs: (options) => readTemplateFile("orms/prisma/auth-controller.ts.ejs", options)
        }
    },
    mongoose: {
        name: "mongoose",
        templater: {
            userModelTs: (options) => readTemplateFile("orms/mongoose/user-model.ts.ejs", options),
            tokenModelTs: (options) => readTemplateFile("orms/mongoose/token-model.ts.ejs", options),
            dbTs: (options) => readTemplateFile("orms/mongoose/db.ts.ejs", options),
            authControllerTs: (options) => readTemplateFile("orms/mongoose/auth-controller.ts.ejs", options),
            seedTs: (options) => readTemplateFile("orms/mongoose/seed.ts.ejs", options)
        }
    }
};
