import { FrameworkEnum, DatabaseEnum, OrmEnum } from "../enums/enums.js";

export interface ProjectConfig {
    projectName: string;
    framework: FrameworkEnum;
    database: DatabaseEnum;
    orm: OrmEnum;
    includeAuth?: boolean;
}

export type PackageManager = "npm" | "yarn" | "pnpm";
