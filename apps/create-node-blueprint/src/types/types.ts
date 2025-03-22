import { FrameworkEnum, DatabaseEnum, OrmEnum } from "../enums/enums.js";

export interface ProjectConfig {
    projectName: string;
    framework: FrameworkEnum;
    database: DatabaseEnum;
    orm: OrmEnum;
    features: Array<string>;
}

export type PackageManager = "npm" | "yarn" | "pnpm";
