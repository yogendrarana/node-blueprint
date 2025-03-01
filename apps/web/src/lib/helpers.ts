export type FileType = {
    name: string;
    type: "file" | "directory";
    children?: FileType[];
};

export const generateProjectStructure = (
    framework: string,
    database: string,
    orm: string
): FileType[] => {
    // Base structure
    const structure: FileType[] = [
        {
            name: `${framework}-${database}-${orm}`,
            type: "directory",
            children: [
                {
                    name: "src",
                    type: "directory",
                    children: [
                        {
                            name: "config",
                            type: "directory",
                            children: [
                                {
                                    name: "db.config.ts",
                                    type: "file"
                                },
                                {
                                    name: "env.config.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "controllers",
                            type: "directory",
                            children: [
                                {
                                    name: "user.controller.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "models",
                            type: "directory",
                            children: [
                                {
                                    name: "user.model.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "routes",
                            type: "directory",
                            children: [
                                {
                                    name: "user.routes.ts",
                                    type: "file"
                                },
                                {
                                    name: "index.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "index.ts",
                            type: "file"
                        }
                    ]
                },
                {
                    name: ".env",
                    type: "file"
                },
                {
                    name: ".gitignore",
                    type: "file"
                },
                {
                    name: "package.json",
                    type: "file"
                },
                {
                    name: "README.md",
                    type: "file"
                },
                {
                    name: "tsconfig.json",
                    type: "file"
                }
            ]
        }
    ];

    // Add ORM-specific files
    if (orm === "prisma" || orm === "drizzle") {
        // Find the main directory
        const mainDir = structure[0];

        if (orm === "prisma") {
            mainDir.children?.push({
                name: "prisma",
                type: "directory",
                children: [
                    {
                        name: "schema.prisma",
                        type: "file"
                    }
                ]
            });
        } else {
            mainDir.children?.push({
                name: "drizzle",
                type: "directory",
                children: [
                    {
                        name: "schema.ts",
                        type: "file"
                    },
                    {
                        name: "migrations",
                        type: "directory",
                        children: [
                            {
                                name: "0000_initial.sql",
                                type: "file"
                            }
                        ]
                    }
                ]
            });
        }
    }

    return structure;
};
