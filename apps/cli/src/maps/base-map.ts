import { readTemplateFile } from "../utils/utils.js";
import { TemplaterFunctionType } from "./framework-map.js";

type TBaseMap = Record<string, IBaseConfig>;

export interface IBaseConfig {
    name: string;
    templater: {
        packageJson?: TemplaterFunctionType;
        env?: TemplaterFunctionType;
        gitignore?: TemplaterFunctionType;
        tsconfig?: TemplaterFunctionType;
        readme?: TemplaterFunctionType;
        indexEjs?: TemplaterFunctionType
    };
}

export const BaseMap: TBaseMap = {
    base: {
        name: "base",
        templater: {
            packageJson: (options) => readTemplateFile("base/package.json.ejs", options),
            env: (options) => readTemplateFile("base/.env.ejs", options),
            gitignore: (options) => readTemplateFile("base/.gitignore.ejs", options),
            tsconfig: (options) => readTemplateFile("base/tsconfig.json.ejs", options),
            readme: (options) => readTemplateFile("base/README.md.ejs", options),
            indexEjs: (options) => readTemplateFile("base/index.ejs", options),
        }
    }
};
