import { select, isCancel } from "@clack/prompts";
import { DatabaseEnum, OrmEnum } from "../enums/enums.js";

export async function getOrm(database: DatabaseEnum) {
    const ormOptions = database === DatabaseEnum.mongodb
        ? [{ value: OrmEnum.mongoose, label: "Mongoose" }]
        : [
            { value: OrmEnum.drizzle, label: "Drizzle" },
            { value: OrmEnum.prisma, label: "Prisma" }
        ];

    const answer = await select({
        message: "Which ORM/ODM would you like to use?",
        options: ormOptions,
        initialValue: database === DatabaseEnum.mongodb ? OrmEnum.mongoose : OrmEnum.drizzle
    });

    if (isCancel(answer)) process.exit(0);
    return answer;
} 