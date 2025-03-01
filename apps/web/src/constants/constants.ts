export interface CommandOption {
    id: string;
    label: string;
    flag: string;
    status: "available" | "coming-soon";
}

export const frameworks: CommandOption[] = [
    { id: "express", label: "Express", flag: "express", status: "available" },
    { id: "fastify", label: "Fastify", flag: "fastify", status: "coming-soon" }
];

export const databases: CommandOption[] = [
    { id: "postgres", label: "PostgreSQL", flag: "postgres", status: "available" },
    { id: "mysql", label: "MySQL", flag: "mysql", status: "available" },
    { id: "mongodb", label: "MongoDB", flag: "mongodb", status: "coming-soon" }
];

export const orms: CommandOption[] = [
    { id: "drizzle", label: "Drizzle", flag: "drizzle", status: "available" },
    { id: "prisma", label: "Prisma", flag: "prisma", status: "available" },
    { id: "mongoose", label: "Mongoose", flag: "mongoose", status: "coming-soon" }
];
