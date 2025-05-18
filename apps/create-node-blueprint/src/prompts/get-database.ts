import { select, isCancel } from "@clack/prompts";
import { DatabaseEnum } from "../enums/enums.js";

export async function getDatabase() {
    const answer = await select({
        message: "Which database would you like to use?",
        options: [
            { value: DatabaseEnum.mongodb, label: "MongoDB" },
            { value: DatabaseEnum.mysql, label: "MySQL" },
            { value: DatabaseEnum.postgres, label: "PostgreSQL" },
        ],
        initialValue: DatabaseEnum.postgres
    });
    if (isCancel(answer)) process.exit(0);
    return answer;
} 