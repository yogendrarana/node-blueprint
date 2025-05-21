import pc from "picocolors";
import { relative } from "path";
import { consola } from "consola";

import { DatabaseEnum, OrmEnum, PackageManagerEnum } from "../enums/enums.js";
import { packageManagerConfig } from "../utils/utils.js";

interface PostCreationInstructionsOptions {
    projectPath: string;
    packageManager: PackageManagerEnum;
    installDependencies: boolean;
    orm: OrmEnum;
}

export function showPostCreationInstructions(options: PostCreationInstructionsOptions): void {
    const { projectPath, packageManager, installDependencies, orm } = options;
    const relativePath = relative(process.cwd(), projectPath);
    const pmCommands = packageManagerConfig(packageManager);

    const dbCommands = {
        [OrmEnum.prisma]: [
            "Generate migration: npx prisma migrate dev",
            "Apply migration: npx prisma migrate deploy"
        ],
        [OrmEnum.drizzle]: [
            "Generate migration: npm run db:generate",
            "Apply migration: npm run db:migrate"
        ],
        [OrmEnum.mongoose]: [
            "No migrations needed for MongoDB"
        ]
    }[orm];

    consola.box({
        title: pc.bold(pc.green("🎉 Project created successfully!")),
        message: [
            pc.bold("Next steps:"),
            `${pc.cyan("1.")} cd ${relativePath.includes(" ") ? `"${relativePath}"` : relativePath}`,
            `${pc.cyan("2.")} ${installDependencies ? pmCommands.commands.dev : pmCommands.commands.install}`,
            "",
            pc.bold("Your app is available at:"),
            pc.gray("The server is available on port 8000"),
            "",
            pc.bold("Database commands:"),
            ...dbCommands.map(cmd => pc.gray(`- ${cmd}`)),
            "",
            pc.gray("Thank you for using node-blueprint. If you find node-blueprint useful, please give it a star on GitHub!"),
            pc.gray("https://github.com/yogendrarana/node-blueprint")
        ].join("\n")
    });
} 