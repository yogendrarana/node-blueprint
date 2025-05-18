import { select, isCancel } from "@clack/prompts";
import { PackageManagerEnum } from "../enums/enums.js";

export async function getPackageManager() {
    const answer = await select({
        message: "Which package manager would you like to use?",
        options: [
            { label: "npm", value: PackageManagerEnum.npm },
            { label: "pnpm", value: PackageManagerEnum.pnpm },
            { label: "yarn", value: PackageManagerEnum.yarn },
        ],
        initialValue: PackageManagerEnum.npm
    });
    
    if (isCancel(answer)) process.exit(0);
    return answer;
} 