import { select, isCancel } from "@clack/prompts";

export async function getAuth() {
    const answer = await select({
        message: "Would you like to include one of the following authentication?",
        options: [
            { label: "Basic JWT authentication", value: "jwt-auth" },
            { label: "None", value: "none" }
        ]
    });

    return answer;
}
