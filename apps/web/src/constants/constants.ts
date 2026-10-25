export interface CommandOption {
	id: string;
	label: string;
	flag: string;
	status: "available" | "coming-soon";
}

export const frameworks: CommandOption[] = [
	{ id: "express", label: "Express", flag: "express", status: "available" },
	{ id: "fastify", label: "Fastify", flag: "fastify", status: "available" },
];

export const databases: CommandOption[] = [
	{ id: "postgres", label: "PostgreSQL", flag: "postgres", status: "available" },
	{ id: "mysql", label: "MySQL", flag: "mysql", status: "available" },
	{ id: "mongodb", label: "MongoDB", flag: "mongodb", status: "available" },
];

export const orms: CommandOption[] = [
	{ id: "drizzle", label: "Drizzle", flag: "drizzle", status: "available" },
	{ id: "prisma", label: "Prisma", flag: "prisma", status: "available" },
	{ id: "mongoose", label: "Mongoose", flag: "mongoose", status: "available" },
];

export const auths: CommandOption[] = [
	{ id: "jwt", label: "JWT Auth", flag: "jwt", status: "available" },
	{ id: "better-auth", label: "Better Auth", flag: "better-auth", status: "coming-soon" },
];

export const features: CommandOption[] = [
	{
		id: "docker",
		label: "Docker setup",
		flag: "docker",
		status: "available",
	},
];

export interface StackPreset {
	id: string;
	name: string;
	framework: string;
	database: string;
	orm: string;
	auth: string;
	features: string[];
}

export const stackPresets: StackPreset[] = [
	{
		id: "modern-sql",
		name: "Modern SQL API",
		framework: "express",
		database: "postgres",
		orm: "drizzle",
		auth: "jwt",
		features: ["docker"],
	},
	{
		id: "high-perf",
		name: "Fastify + Prisma",
		framework: "fastify",
		database: "postgres",
		orm: "prisma",
		auth: "jwt",
		features: ["docker"],
	},
	{
		id: "document-nosql",
		name: "Mongo Document Stack",
		framework: "express",
		database: "mongodb",
		orm: "mongoose",
		auth: "jwt",
		features: ["docker"],
	},
];
