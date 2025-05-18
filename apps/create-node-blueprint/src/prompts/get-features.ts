import { multiselect, isCancel } from "@clack/prompts";
import { FeatureEnum } from "../enums/enums.js";

export async function getFeatures() {
    const answer = await multiselect({
        message: "What additional features would you like to include? (Optional - press space to select, enter to continue)",
        options: [
            { label: "Include basic jwt authentication", value: "auth" },
            { label: "Include Docker setup", value: "docker" }
        ],
        required: false
    });

    return answer;
} 