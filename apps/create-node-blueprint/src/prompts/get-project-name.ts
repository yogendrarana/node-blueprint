import { text, isCancel } from "@clack/prompts";

export async function getProjectName() {
    const answer = await text({
        message: "What would you like to name your project?",
        placeholder: "node-blueprint-starter",
        defaultValue: "node-blueprint-starter",
        validate: (value) => {
            if (!/^[a-z0-9-]+$/.test(value)) {
                return "Project name can only contain lowercase letters, numbers, and hyphens";
            }
            return undefined;
        }
    });

    if (isCancel(answer)) process.exit(0);
    return answer;
} 