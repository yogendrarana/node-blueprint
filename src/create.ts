import fs from "fs";
import path from "path";
import { AnswerType } from "./prompt.js";

export async function create(answers: AnswerType) {
    const { projectName, framework, database, orm, auth } = answers;

    // define project root directory
    const projectDir = path.join(process.cwd(), projectName);

    // Create project root directory
    fs.mkdirSync(projectDir, { recursive: true });
}
