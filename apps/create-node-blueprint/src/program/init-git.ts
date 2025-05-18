import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export async function initGit(projectPath: string): Promise<void> {
    try {
        // Check if git is installed
        execSync("git --version", { stdio: "ignore" });
    } catch (error) {
        console.warn("Git is not installed. Skipping git initialization.");
        return;
    }

    const gitConfigPath = join(projectPath, ".git");
    
    // Check if git is already initialized
    if (existsSync(gitConfigPath)) {
        console.log("Git repository already exists.");
        return;
    }

    try {
        // Initialize git repository with hints suppressed
        execSync("git init --quiet", { cwd: projectPath, stdio: "ignore" });
    } catch (error) {
        console.error("Failed to initialize git repository:", error);
        throw error;
    }
} 