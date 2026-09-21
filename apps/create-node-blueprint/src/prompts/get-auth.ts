import { select } from "@clack/prompts";

export async function getAuth() {
	const answer = await select({
		message: "Would you like to include one of the following authentication?",
		options: [
			{ label: "Basic JWT authentication", value: "jwt" },
			{ label: "None", value: "none" },
		],
	});

	return answer;
}
