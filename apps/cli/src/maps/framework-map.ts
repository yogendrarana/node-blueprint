import { ProjectConfig } from "../types/types.js";
import { readTemplateFile } from "../utils/utils.js";

type FrameworkMapType = Record<string, IFrameworkConfig>;

export type TemplaterFunctionType = (options: ProjectConfig) => Promise<string>;

export interface IFrameworkConfig {
    name: string;
    templater: {
        appTs?: TemplaterFunctionType;
        serverTs?: TemplaterFunctionType;
        routerTs?: TemplaterFunctionType;
        userRoutesTs?: TemplaterFunctionType;
        userControllerTs?: TemplaterFunctionType;
        errorMiddlewareTs?: TemplaterFunctionType;
        errorHandlerTs?: TemplaterFunctionType;
        loggerTs?: TemplaterFunctionType;
    };
}

// framework map
export const FrameworkMap: FrameworkMapType = {
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
    }
};
