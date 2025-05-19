import { FrameworkEnum, DatabaseEnum, OrmEnum, AuthEnum } from "../enums/enums.js";

export interface ProjectConfig {
    projectName: string;
    framework: FrameworkEnum;
    database: DatabaseEnum;
    orm: OrmEnum;
    features: Array<string>;
    installDependencies: boolean;
    initializeGit: boolean;
    auth?: AuthEnum
}

export type PackageManager = "npm" | "yarn" | "pnpm";
