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

export const generateProjectStructure = ({ name, framework, orm, features = [], auth }: ProjectConfig): FileType[] => {
    const projectName = name || "my-app";
    const isExpress = framework === "express" || !framework;
    const hasJwt = auth === "jwt" || auth === "jwt-auth";

    // 1. App layer children
    const configChildren: FileType[] = [
        { name: "env.ts", type: "file" },
        { name: "cors.ts", type: "file" },
        ...(isExpress ? [{ name: "logger.ts", type: "file" } as const] : [])
    ];

    const httpChildren: FileType[] = [
        { name: "server.ts", type: "file" },
        { name: "app.ts", type: "file" },
        ...(isExpress
            ? [
                  {
                      name: "middleware",
                      type: "directory",
                      children: [
                          { name: "cors.middleware.ts", type: "file" },
                          { name: "error.middleware.ts", type: "file" },
                          { name: "helmet.middleware.ts", type: "file" }
                      ]
                  } as FileType
              ]
            : [])
    ];

    const appChildren: FileType[] = [
        { name: "config", type: "directory", children: configChildren },
        { name: "http", type: "directory", children: httpChildren },
        { name: "routes.ts", type: "file" }
    ];

    // 2. Modules layer children
    const healthModule: FileType = {
        name: "health",
        type: "directory",
        children: [
            { name: "health.controller.ts", type: "file" },
            { name: "health.routes.ts", type: "file" }
        ]
    };

    const userModule: FileType = {
        name: "users",
        type: "directory",
        children: [
            { name: "user.controller.ts", type: "file" },
            { name: "user.routes.ts", type: "file" },
            { name: "user.repo.ts", type: "file" },
            { name: "user.types.ts", type: "file" }
        ]
    };

    const modulesChildren: FileType[] = [healthModule, userModule];

    if (hasJwt) {
        modulesChildren.push({
            name: "auth",
            type: "directory",
            children: [
                { name: "auth.controller.ts", type: "file" },
                { name: "auth.routes.ts", type: "file" },
                { name: "auth.schema.ts", type: "file" },
                { name: "auth.service.ts", type: "file" },
                { name: "auth.types.ts", type: "file" }
            ]
        });
    }

    // 3. Infrastructure layer children
    const databaseChildren: FileType[] = [
        { name: "index.ts", type: "file" }
    ];

    if (orm === "drizzle") {
        databaseChildren.push(
            { name: "schema.ts", type: "file" },
            {
                name: "schema",
                type: "directory",
                children: [
                    { name: "user.schema.ts", type: "file" },
                    ...(hasJwt ? [{ name: "token.schema.ts", type: "file" } as const] : [])
                ]
            },
            { name: "seed.ts", type: "file" }
        );
    } else if (orm === "mongoose") {
        databaseChildren.push(
            {
                name: "models",
                type: "directory",
                children: [
                    { name: "user.model.ts", type: "file" },
                    ...(hasJwt ? [{ name: "token.model.ts", type: "file" } as const] : [])
                ]
            },
            { name: "seed.ts", type: "file" }
        );
    }

    const infrastructureChildren: FileType[] = [
        { name: "database", type: "directory", children: databaseChildren },
        { name: "cache", type: "directory", children: [{ name: "index.ts", type: "file" }] },
        { name: "queue", type: "directory", children: [{ name: "index.ts", type: "file" }] },
        { name: "storage", type: "directory", children: [{ name: "index.ts", type: "file" }] },
        { name: "mail", type: "directory", children: [{ name: "index.ts", type: "file" }] },
        { name: "payments", type: "directory", children: [{ name: "index.ts", type: "file" }] }
    ];

    // 4. Shared layer children
    const sharedChildren: FileType[] = [
        {
            name: "errors",
            type: "directory",
            children: [
                { name: "app-error.ts", type: "file" },
                { name: "error-codes.ts", type: "file" }
            ]
        },
        {
            name: "utils",
            type: "directory",
            children: [
                { name: "pagination.ts", type: "file" },
                { name: "dates.ts", type: "file" }
            ]
        },
        {
            name: "types",
            type: "directory",
            children: [{ name: "common.ts", type: "file" }]
        },
        {
            name: "constants",
            type: "directory",
            children: [
                { name: "index.ts", type: "file" },
                { name: "roles.ts", type: "file" },
                ...(hasJwt ? [{ name: "tokens.ts", type: "file" } as const] : [])
            ]
        }
    ];

    // 5. Src children
    const srcChildren: FileType[] = [
        { name: "app", type: "directory", children: appChildren },
        { name: "modules", type: "directory", children: modulesChildren },
        { name: "infrastructure", type: "directory", children: infrastructureChildren },
        { name: "shared", type: "directory", children: sharedChildren },
        { name: "index.ts", type: "file" }
    ];

    // Root project children
    const rootChildren: FileType[] = [
        { name: ".env", type: "file" },
        { name: ".gitignore", type: "file" },
        { name: "biome.json", type: "file" },
        { name: "package.json", type: "file" },
        { name: "tsconfig.json", type: "file" },
        { name: "README.md", type: "file" },
        ...(features.includes("docker")
            ? [
                  { name: ".dockerignore", type: "file" } as const,
                  { name: "Dockerfile", type: "file" } as const,
                  { name: "docker-compose.yml", type: "file" } as const
              ]
            : []),
        ...(orm === "drizzle" ? [{ name: "drizzle.config.ts", type: "file" } as const] : []),
        ...(orm === "prisma"
            ? [
                  {
                      name: "prisma",
                      type: "directory",
                      children: [
                          { name: "schema.prisma", type: "file" },
                          { name: "seed.ts", type: "file" }
                      ]
                  } as FileType
              ]
            : []),
        { name: "src", type: "directory", children: srcChildren },
        {
            name: "tests",
            type: "directory",
            children: [
                { name: "unit", type: "directory", children: [] },
                { name: "integration", type: "directory", children: [] },
                { name: "e2e", type: "directory", children: [] }
            ]
        }
    ];

    const baseStructure: FileType[] = [
        {
            name: projectName,
            type: "directory",
            children: rootChildren
        }
    ];

    // Recursively sort directories
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

    sortDirectory(baseStructure[0]);

    return baseStructure;
};
