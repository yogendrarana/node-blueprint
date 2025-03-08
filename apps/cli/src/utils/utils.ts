import ejs from "ejs";
import fs from "fs/promises";
import path from "node:path";
import { ProjectConfig } from "../types/types.js";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// get package manager from user agent
export const packgeManageFromUserAgent = (userAgent: string | undefined) => {
    if (!userAgent) {
        return undefined;
    }

    const pkgSpec = userAgent.split(" ")[0];
    const pkgManager = pkgSpec.split("/")[0];
    const pkgVersion = pkgSpec.split("/")[1];

    return {
        name: pkgManager,
        version: pkgVersion
    };
};

export const packageManagerCommands = (pkgManager: string) => {
    return {
        install: `${pkgManager} install`,
        dev: `${pkgManager}${pkgManager === 'npm' ? ' run' : ''} dev`,
        add: `${pkgManager} ${pkgManager === 'yarn' || pkgManager === 'pnpm' ? 'add' : 'install'
            }`,
        addDev: `${pkgManager} ${pkgManager === 'yarn' || pkgManager === 'pnpm' ? 'add -D' : 'install -D'
            }`,
        exec: pkgManager === 'npm' ? 'npx' : pkgManager
    };
};

// read template file
export const readTemplateFile = async (
    templatePath: string,
    options: ProjectConfig | Record<string, any>
): Promise<string> => {
    try {
        const fullTemplatePath = path.resolve(__dirname, "..", "template", templatePath);
        const template = await fs.readFile(fullTemplatePath, "utf-8");
        const content = ejs.render(template, options, { async: false, strict: false });
        return content;
    } catch (err: any) {
        console.error(err);
        throw new Error(`Failed to read or render template: ${err.message}`);
    }
};

// check if dir exists. this helps to avoid creating a directory that already exists.
export const checkDirExists = async (dirPath: string): Promise<boolean> => {
    try {
        await fs.access(dirPath);
        return true;
    } catch (err: any) {
        return false;
    }
};

// Ensure directory exists, create if missing
export const ensureDirExists = async (dirPath: string): Promise<void> => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err: any) {
        throw new Error(`Failed to create directory: ${err.message}`);
    }
};

// Ensure file exists, create if missing
export const ensureFileExists = async (filePath: string): Promise<void> => {
    try {
        await fs.writeFile(filePath, "", { flag: "wx" });
    } catch (err: any) {
        if (err.code !== "EEXIST") {
            throw new Error(`Failed to create file: ${err.message}`);
        }
    }
};

// create file with content
export const createFileWithContent = async (filePath: string, content: string): Promise<void> => {
    try {
        await fs.writeFile(filePath, content, { encoding: "utf-8" });
    } catch (err: any) {
        console.error(err);
        throw new Error(`Failed to create file: ${err.message}`);
    }
};
