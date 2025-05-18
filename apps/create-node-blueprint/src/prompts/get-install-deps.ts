import { select, isCancel } from "@clack/prompts";

export async function getInstallDependencies() {
    const answer = await select({
        message: "Would you like to install dependencies now? (Recommended)",
        options: [
            { label: "Yes, install dependencies", value: true },
            { label: "No, I'll install them later", value: false }
        ],
        initialValue: true
    });
    
    if (isCancel(answer)) process.exit(0);
    return answer;
} 