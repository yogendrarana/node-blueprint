import { ProjectConfig } from "@/components/project-structure";

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

export const generateProjectStructure = ({ name, framework, orm, features }: ProjectConfig): FileType[] => {
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
                ...(features.includes("docker")
                    ? [
                          { name: "Dockerfile", type: "file" } as const,
                          { name: ".dockerignore", type: "file" } as const,
                          { name: "docker-compose.yml", type: "file" } as const
                      ]
                    : []),
                {
                    name: "src",
                    type: "directory",
                    children: [
                        { name: "app.ts", type: "file" },
                        { name: "routers.ts", type: "file" },
                        { name: "server.ts", type: "file" },
                        {
                            name: "routes",
                            type: "directory",
                            children: [
                                {
                                    name: "user-routes.ts",
                                    type: "file"
                                },
                                {
                                    name: "health-routes.ts",
                                    type: "file"
                                },
                                ...(features?.includes("auth") ? [{ name: "auth-routes.ts", type: "file" } as const] : [])
                            ]
                        },
                        {
                            name: "controllers",
                            type: "directory",
                            children: [
                                {
                                    name: "user-controller.ts",
                                    type: "file"
                                },
                                {
                                    name: "health-controller.ts",
                                    type: "file"
                                },
                                ...(features?.includes("auth") ? [{ name: "auth-controller.ts", type: "file" } as const] : [])
                            ]
                        },
                        {
                            name: "middlewares",
                            type: "directory",
                            children: [...(framework === "express" ? [{ name: "error-middleware.ts", type: "file" } as const] : [])]
                        },
                        {
                            name: "config",
                            type: "directory",
                            children: [
                                {
                                    name: "env.ts",
                                    type: "file"
                                },
                                ...(framework === "express" ? [{ name: "logger.ts", type: "file" } as const] : []),
                                ...(orm === "mongoose" ? [{ name: "db.ts", type: "file" } as const] : [])
                            ]
                        },
                        {
                            name: "views",
                            type: "directory",
                            children: [{ name: "index.ejs", type: "file" }]
                        },
                        {
                            name: "services",
                            type: "directory",
                            children: [
                                {
                                    name: "user-service.ts",
                                    type: "file"
                                },
                                ...(features?.includes("auth") ? [{ name: "auth-service.ts", type: "file" } as const] : [])
                            ]
                        },
                        {
                            name: "types",
                            type: "directory",
                            children: [
                                {
                                    name: "enums",
                                    type: "directory",
                                    children: [
                                        ...(features.includes("auth") && orm !== "prisma"
                                            ? [{ name: "token-enum.ts", type: "file" } as const, { name: "role-enum.ts", type: "file" } as const]
                                            : [])
                                    ]
                                },
                                {
                                    name: "interfaces",
                                    type: "directory",
                                    children: []
                                }
                            ]
                        },
                        {
                            name: "utils",
                            type: "directory",
                            children: []
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
                { name: "prisma-client.ts", type: "file" },
                { name: "schema.prisma", type: "file" },
                { name: "seed.ts", type: "file" }
            ]
        });
    }

    if (orm === "drizzle") {
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
                                name: "user-schema.ts",
                                type: "file"
                            },
                            ...(features?.includes("auth") ? [{ name: "token-schema.ts", type: "file" } as const] : [])
                        ]
                    }
                ]
            }
        );
    }

    if (orm === "mongoose") {
        (mainDir.children.find((c) => c.name === "src")?.children ?? []).push({
            name: "models",
            type: "directory",
            children: [
                {
                    name: "user-model.ts",
                    type: "file"
                },
                {
                    name: "seed.ts",
                    type: "file"
                },
                ...(features?.includes("auth") ? [{ name: "token-model.ts", type: "file" }] : [])
            ]
        } as FileType);
    }

    // Sort the children of the root directory and any subdirectories
    const sortDirectory = (dir: FileType) => {
        if (dir.children) {
            dir.children.sort(sortFileStructure);
            dir.children.forEach((child) => {
                if (child.type === "directory") {
                    sortDirectory(child);
                }
            });
        }
    };

    // Sort the main directory
    sortDirectory(mainDir);

    return baseStructure;
};
