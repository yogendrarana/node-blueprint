import { FrameworkEnum, DatabaseEnum, OrmEnum } from "../enums/enums.js";

export interface ProjectConfig {
    projectName: string;
    framework: FrameworkEnum;
    database: DatabaseEnum;
    orm: OrmEnum;
}
