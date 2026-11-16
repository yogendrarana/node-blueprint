import { text, isCancel } from "@clack/prompts";

export async function getProjectName() {
	const answer = await text({
		message: "What would you like to name your project?",
		placeholder: "node-blueprint-starter",
		defaultValue: "node-blueprint-starter",
		validate: (value) => {
			if (value === ".") return undefined;
			if (!/^[a-z0-9-]+$/.test(value ?? "")) {
				return "Project name can only contain lowercase letters, numbers, and hyphens (or '.' for current directory)";
			}
			return undefined;
		},
	});

	if (isCancel(answer)) process.exit(0);
	return answer;
}
