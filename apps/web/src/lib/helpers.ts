export interface FileType {
    name: string;
    type: "file" | "directory";
    children?: FileType[];
}

const sortFileStructure = (a: FileType, b: FileType): number => {
    if (a.type === "directory" && b.type === "file") {
        return -1;
    }

    if (a.type === "file" && b.type === "directory") {
        return 1;
    }

    // For files, put dotfiles (e.g., .env) before other files
    if (a.type === "file" && b.type === "file") {
        if (a.name.startsWith(".") && !b.name.startsWith(".")) {
            return -1;
        }

        if (!a.name.startsWith(".") && b.name.startsWith(".")) {
            return 1;
        }

        return a.name.localeCompare(b.name);
    }

    return 0;
};

export const generateProjectStructure = ({
    name,
    orm
}: {
    name: string;
    orm: string;
}): FileType[] => {
    const baseStructure: FileType[] = [
        {
            name: name,
            type: "directory",
            children: [
                { name: "package.json", type: "file" },
                { name: ".env", type: "file" },
                { name: ".gitignore", type: "file" },
                { name: "tsconfig.json", type: "file" },
                { name: "README.md", type: "file" },
                {
                    name: "src",
                    type: "directory",
                    children: [
                        { name: "app.ts", type: "file" },
                        { name: "routers.ts", type: "file" },
                        { name: "server.ts", type: "file" },
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
                            name: "routes",
                            type: "directory",
                            children: [
                                {
                                    name: "user.routes.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "config",
                            type: "directory",
                            children: [
                                {
                                    name: "env.config.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "views",
                            type: "directory",
                            children: [{ name: "home.ejs", type: "file" }]
                        }
                    ]
                }
            ]
        }
    ];

    const mainDir = baseStructure[0];
    if (!mainDir.children) mainDir.children = [];

    // Add ORM-specific structure
    if (orm === "prisma") {
        mainDir.children.push({
            name: "prisma",
            type: "directory",
            children: [
                { name: "index.ts", type: "file" },
                { name: "schema.prisma", type: "file" },
                { name: "seed.ts", type: "file" }
            ]
        });
    } else if (orm === "drizzle") {
        mainDir.children.push(
            { name: "drizzle.config.ts", type: "file" },
            {
                name: "drizzle",
                type: "directory",
                children: [
                    { name: "index.ts", type: "file" },
                    { name: "schema.ts", type: "file" },
                    { name: "seed.ts", type: "file" },
                    {
                        name: "schemas",
                        type: "directory",
                        children: [
                            {
                                name: "user.schema.ts",
                                type: "file"
                            }
                        ]
                    }
                ]
            }
        );
    }

    // Sort the children of the root directory and any subdirectories
    const sortDirectory = (dir: FileType) => {
        if (dir.children) {
            // Sort files and directories
            dir.children.sort(sortFileStructure);
            // Recursively sort any subdirectories
            dir.children.forEach((child) => {
                if (child.type === "directory") {
                    sortDirectory(child); // Recursively sort subdirectories
                }
            });
        }
    };

    // Sort the main directory
    sortDirectory(mainDir);

    return baseStructure;
};
