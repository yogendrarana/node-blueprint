import { select, isCancel } from "@clack/prompts";
import { FrameworkEnum } from "../enums/enums.js";

export async function getFramework() {
    const answer = await select({
        message: "Which Node.js framework would you like to use?",
        options: [{ label: "Express", value: FrameworkEnum.express }],
        initialValue: FrameworkEnum.express
    });
    
    if (isCancel(answer)) process.exit(0);
    return answer;
} 