import { create } from "./create.js";
import { AnswerType, askAllQuestions } from "./prompt.js";

async function main() {
    const answers = await askAllQuestions();
    await create(answers);
}

main();
