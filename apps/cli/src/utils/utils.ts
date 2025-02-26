import fs from "fs/promises";
import path from "node:path";

// get package manager from user agent
export const getPackageManager = () => {
    const userAgent = process.env.npm_config_user_agent;

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

// copy dir
export async function copyDir(srcDir: string, destDir: string): Promise<void> {
    try {
        await fs.mkdir(destDir, { recursive: true });
        const files = await fs.readdir(srcDir);

        await Promise.all(
            files.map(async (file) => {
                const srcFile = path.resolve(srcDir, file);
                const destFile = path.resolve(destDir, file);

                const stat = await fs.stat(srcFile);

                if (stat.isDirectory()) {
                    await copyDir(srcFile, destFile);
                } else {
                    await fs.copyFile(srcFile, destFile);
                }
            })
        );
    } catch (err: any) {
        console.error(err);
    }
}
