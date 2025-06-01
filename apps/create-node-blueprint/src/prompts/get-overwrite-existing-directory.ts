import { isCancel, select } from "@clack/prompts"

const getOverwriteExistingDirectory = async (projectName: string) => {
    const answer = await select({
        message: `The directory "${projectName}" already exists. Would you like to overwrite it?`,
        options: [
            { label: "Yes, overwrite the existing directory", value: true },
            { label: "No, cancel the operation", value: false }
        ],
        initialValue: false as boolean
    })

    if (isCancel(answer)) process.exit(0);
    return answer;
}

export default getOverwriteExistingDirectory;