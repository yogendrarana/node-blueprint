import { isCancel, select } from "@clack/prompts";

const getOverwriteExistingDirectory = async (projectName: string, isCurrentDir = false) => {
	const message = isCurrentDir
		? "The current directory is not empty. Would you like to overwrite its contents?"
		: `The directory "${projectName}" already exists. Would you like to overwrite it?`;

	const answer = await select({
		message,
		options: [
			{ label: isCurrentDir ? "Yes, clear the current directory" : "Yes, overwrite the existing directory", value: true },
			{ label: "No, cancel the operation", value: false },
		],
		initialValue: false as boolean,
	});

	if (isCancel(answer)) process.exit(0);
	return answer;
};

export default getOverwriteExistingDirectory;
