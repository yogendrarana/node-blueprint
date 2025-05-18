import { select, isCancel } from "@clack/prompts";

export async function getInitializeGit() {
    const answer = await select({
        message: "Would you like to initialize a git repository?",
        options: [
            { label: "Yes, please do", value: true },
            { label: "No, I'll do it myself", value: false }
        ]
    });
    
    if (isCancel(answer)) process.exit(0);
    return answer;
} 