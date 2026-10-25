import { ProjectConfig } from "@/components/project-structure";

export interface FileType {
	name: string;
	type: "file" | "directory";
	children?: FileType[];
}

const rawEjsTemplates = import.meta.glob("../../../create-node-blueprint/src/template/**/*.ejs", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

// Normalize template map keys to relative paths under `template/`, e.g. "root/env.ejs"
const templateStore: Record<string, string> = {};
for (const [fullPath, content] of Object.entries(rawEjsTemplates)) {
	const marker = "/template/";
	const idx = fullPath.indexOf(marker);
	if (idx !== -1) {
		templateStore[fullPath.slice(idx + marker.length)] = content;
	}
}

/**
 * Renders an EJS template string using the provided context variables.
 * Supports `<%= expr %>`, `<%_ code _%>` (whitespace slurping), and `<% code %>`.
 */
const renderEjsTemplate = (template: string, context: Record<string, unknown>): string => {
	// Slurp horizontal whitespace before `<%_` and horizontal whitespace + single newline after `_%>`
	const normalized = template
		.replace(/[ \t]*<%_/g, "<%_")
		.replace(/_%>[ \t]*\r?\n?/g, "_%>");

	const tagRegex = /<%([_=+-]?)([\s\S]*?)(_?)%>/g;
	let cursor = 0;
	let fnBody = 'let __out = "";\n';

	let match: RegExpExecArray | null = tagRegex.exec(normalized);
	while (match !== null) {
		const [fullMatch, prefix, innerCode] = match;
		const matchIndex = match.index;

		if (matchIndex > cursor) {
			const literal = normalized.slice(cursor, matchIndex);
			fnBody += `__out += ${JSON.stringify(literal)};\n`;
		}

		if (prefix === "=" || prefix === "-") {
			fnBody += `__out += String((${innerCode.trim()}) ?? "");\n`;
		} else {
			fnBody += `${innerCode}\n`;
		}

		cursor = matchIndex + fullMatch.length;
		match = tagRegex.exec(normalized);
	}

	if (cursor < normalized.length) {
		fnBody += `__out += ${JSON.stringify(normalized.slice(cursor))};\n`;
	}

	fnBody += "return __out;";

	const keys = Object.keys(context);
	const values = Object.values(context);
	const renderer = new Function(...keys, fnBody);
	return String(renderer(...values)).trimStart();
};

const DEPENDENCIES: Record<string, string> = {
	"cookie-parser": "^1.4.6",
	dotenv: "^16.5.0",
	zod: "^3.25.64",
	cors: "^2.8.5",
	helmet: "^8.1.0",
	express: "^5.1.0",
	winston: "^3.17.0",
	"winston-daily-rotate-file": "^5.0.0",
	fastify: "^5.3.3",
	"@fastify/cors": "^11.0.1",
	"@fastify/helmet": "^13.0.1",
	"@fastify/cookie": "^11.0.2",
	pg: "^8.16.0",
	mysql2: "^3.14.1",
	mariadb: "^3.5.4",
	mongoose: "^8.15.2",
	"@prisma/client": "^7.10.0",
	"@prisma/adapter-pg": "^7.10.0",
	"@prisma/adapter-mariadb": "^7.10.0",
	"drizzle-orm": "^0.44.2",
	jsonwebtoken: "^9.0.2",
	bcrypt: "^6.0.0",
};

const DEV_DEPENDENCIES: Record<string, string> = {
	"@types/node": "^24.0.1",
	typescript: "^5.8.3",
	tsx: "^4.20.3",
	"@types/cookie-parser": "^1.4.9",
	"@types/cors": "^2.8.19",
	"@types/express": "^5.0.3",
	"@types/pg": "^8.15.4",
	"@types/mongoose": "^5.11.97",
	"@types/bcrypt": "^5.0.2",
	"@types/jsonwebtoken": "^9.0.9",
	"@biomejs/biome": "^2.4.15",
	prisma: "^7.10.0",
	"drizzle-kit": "^0.31.1",
};

const generatePackageJsonString = ({
	projectName,
	framework,
	database,
	orm,
	auth,
}: {
	projectName: string;
	framework: string;
	database: string;
	orm: string;
	auth: string;
}): string => {
	const dependencies: Record<string, string> = {
		dotenv: DEPENDENCIES["dotenv"],
		zod: DEPENDENCIES["zod"],
	};

	const devDependencies: Record<string, string> = {
		"@types/node": DEV_DEPENDENCIES["@types/node"],
		typescript: DEV_DEPENDENCIES["typescript"],
		tsx: DEV_DEPENDENCIES["tsx"],
		"@biomejs/biome": DEV_DEPENDENCIES["@biomejs/biome"],
	};

	if (framework === "express") {
		dependencies["express"] = DEPENDENCIES["express"];
		dependencies["cookie-parser"] = DEPENDENCIES["cookie-parser"];
		dependencies["cors"] = DEPENDENCIES["cors"];
		dependencies["helmet"] = DEPENDENCIES["helmet"];
		dependencies["winston"] = DEPENDENCIES["winston"];
		dependencies["winston-daily-rotate-file"] = DEPENDENCIES["winston-daily-rotate-file"];

		devDependencies["@types/cors"] = DEV_DEPENDENCIES["@types/cors"];
		devDependencies["@types/express"] = DEV_DEPENDENCIES["@types/express"];
		devDependencies["@types/cookie-parser"] = DEV_DEPENDENCIES["@types/cookie-parser"];
	} else if (framework === "fastify") {
		dependencies["fastify"] = DEPENDENCIES["fastify"];
		dependencies["@fastify/cors"] = DEPENDENCIES["@fastify/cors"];
		dependencies["@fastify/helmet"] = DEPENDENCIES["@fastify/helmet"];
		dependencies["@fastify/cookie"] = DEPENDENCIES["@fastify/cookie"];
	}

	if (database === "postgres") {
		dependencies["pg"] = DEPENDENCIES["pg"];
		devDependencies["@types/pg"] = DEV_DEPENDENCIES["@types/pg"];
	} else if (database === "mysql") {
		if (orm === "prisma") {
			dependencies["mariadb"] = DEPENDENCIES["mariadb"];
		} else {
			dependencies["mysql2"] = DEPENDENCIES["mysql2"];
		}
	}

	if (orm === "prisma") {
		dependencies["@prisma/client"] = DEPENDENCIES["@prisma/client"];
		if (database === "postgres") {
			dependencies["@prisma/adapter-pg"] = DEPENDENCIES["@prisma/adapter-pg"];
		} else if (database === "mysql") {
			dependencies["@prisma/adapter-mariadb"] = DEPENDENCIES["@prisma/adapter-mariadb"];
		}
		devDependencies["prisma"] = DEV_DEPENDENCIES["prisma"];
	} else if (orm === "drizzle") {
		dependencies["drizzle-orm"] = DEPENDENCIES["drizzle-orm"];
		devDependencies["drizzle-kit"] = DEV_DEPENDENCIES["drizzle-kit"];
	} else if (orm === "mongoose") {
		dependencies["mongoose"] = DEPENDENCIES["mongoose"];
		devDependencies["@types/mongoose"] = DEV_DEPENDENCIES["@types/mongoose"];
	}

	if (auth === "jwt") {
		dependencies["jsonwebtoken"] = DEPENDENCIES["jsonwebtoken"];
		dependencies["bcrypt"] = DEPENDENCIES["bcrypt"];
		devDependencies["@types/bcrypt"] = DEV_DEPENDENCIES["@types/bcrypt"];
		devDependencies["@types/jsonwebtoken"] = DEV_DEPENDENCIES["@types/jsonwebtoken"];
	}

	const ormScripts =
		orm === "prisma"
			? {
					"db:seed": "tsx prisma/seed.ts",
					"db:generate": "prisma generate",
					"db:push": "prisma db push",
					"db:migrate": "prisma migrate dev",
					"db:reset": "prisma migrate reset",
					"db:introspect": "prisma db pull",
					"db:deploy": "prisma migrate deploy",
					"db:studio": "prisma studio --port 4000",
				}
			: orm === "drizzle"
				? {
						"db:seed": "tsx src/infrastructure/database/seed.ts",
						"db:generate": "npm run build && drizzle-kit generate",
						"db:push": "drizzle-kit push",
						"db:migrate": "tsx src/infrastructure/database/migrate.ts",
						"db:drop-migration": "drizzle-kit drop",
						"db:introspect": "drizzle-kit introspect",
						"db:studio": "drizzle-kit studio --port 4000",
					}
				: orm === "mongoose"
					? {
							"db:seed": "tsx src/infrastructure/database/seed.ts",
						}
					: {};

	return JSON.stringify(
		{
			name: projectName,
			version: "1.0.0",
			description: "",
			main: "dist/index.js",
			type: "module",
			scripts: {
				build: "npx tsc",
				start: "node dist/index.js",
				dev: "tsx watch src/index.ts",
				lint: "biome lint .",
				format: "biome format --write .",
				check: "biome check .",
				...ormScripts,
			},
			keywords: [],
			author: "",
			license: "ISC",
			dependencies,
			devDependencies,
		},
		null,
		2,
	);
};

const sortFileStructure = (a: FileType, b: FileType): number => {
	if (a.type === "directory" && b.type === "file") {
		return -1;
	}

	if (a.type === "file" && b.type === "directory") {
		return 1;
	}

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
		...(isExpress ? [{ name: "logger.ts", type: "file" } as const] : []),
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
							{ name: "helmet.middleware.ts", type: "file" },
						],
					} as FileType,
				]
			: []),
	];

	const appChildren: FileType[] = [
		{ name: "config", type: "directory", children: configChildren },
		{ name: "http", type: "directory", children: httpChildren },
		{ name: "routes.ts", type: "file" },
	];

	// 2. Modules layer children
	const healthModule: FileType = {
		name: "health",
		type: "directory",
		children: [
			{ name: "health.controller.ts", type: "file" },
			{ name: "health.routes.ts", type: "file" },
		],
	};

	const userModule: FileType = {
		name: "users",
		type: "directory",
		children: [
			{ name: "user.controller.ts", type: "file" },
			{ name: "user.routes.ts", type: "file" },
			{ name: "user.repo.ts", type: "file" },
			{ name: "user.types.ts", type: "file" },
		],
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
				{ name: "auth.types.ts", type: "file" },
			],
		});
	}

	// 3. Infrastructure layer children
	const databaseChildren: FileType[] = [{ name: "index.ts", type: "file" }];

	if (orm === "drizzle") {
		databaseChildren.push(
			{ name: "schema.ts", type: "file" },
			{
				name: "schema",
				type: "directory",
				children: [
					{ name: "user.schema.ts", type: "file" },
					...(hasJwt ? [{ name: "token.schema.ts", type: "file" } as const] : []),
				],
			},
			{ name: "seed.ts", type: "file" },
		);
	} else if (orm === "mongoose") {
		databaseChildren.push(
			{
				name: "models",
				type: "directory",
				children: [
					{ name: "user.model.ts", type: "file" },
					...(hasJwt ? [{ name: "token.model.ts", type: "file" } as const] : []),
				],
			},
			{ name: "seed.ts", type: "file" },
		);
	}

	const infrastructureChildren: FileType[] = [
		{ name: "database", type: "directory", children: databaseChildren },
		{ name: "cache", type: "directory", children: [{ name: "index.ts", type: "file" }] },
		{ name: "queue", type: "directory", children: [{ name: "index.ts", type: "file" }] },
		{ name: "storage", type: "directory", children: [{ name: "index.ts", type: "file" }] },
		{ name: "mail", type: "directory", children: [{ name: "index.ts", type: "file" }] },
		{ name: "payments", type: "directory", children: [{ name: "index.ts", type: "file" }] },
	];

	// 4. Shared layer children
	const sharedChildren: FileType[] = [
		{
			name: "errors",
			type: "directory",
			children: [
				{ name: "app-error.ts", type: "file" },
				{ name: "error-codes.ts", type: "file" },
			],
		},
		{
			name: "utils",
			type: "directory",
			children: [
				{ name: "pagination.ts", type: "file" },
				{ name: "dates.ts", type: "file" },
			],
		},
		{
			name: "types",
			type: "directory",
			children: [{ name: "common.ts", type: "file" }],
		},
		{
			name: "constants",
			type: "directory",
			children: [
				{ name: "index.ts", type: "file" },
				{ name: "roles.ts", type: "file" },
				...(hasJwt ? [{ name: "tokens.ts", type: "file" } as const] : []),
			],
		},
	];

	// 5. Src children
	const srcChildren: FileType[] = [
		{ name: "app", type: "directory", children: appChildren },
		{ name: "modules", type: "directory", children: modulesChildren },
		{ name: "infrastructure", type: "directory", children: infrastructureChildren },
		{ name: "shared", type: "directory", children: sharedChildren },
		{ name: "index.ts", type: "file" },
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
					{ name: "docker-compose.yml", type: "file" } as const,
				]
			: []),
		...(orm === "drizzle" ? [{ name: "drizzle.config.ts", type: "file" } as const] : []),
		...(orm === "prisma" ? [{ name: "prisma.config.ts", type: "file" } as const] : []),
		...(orm === "prisma"
			? [
					{
						name: "prisma",
						type: "directory",
						children: [
							{ name: "schema.prisma", type: "file" },
							{
								name: "models",
								type: "directory",
								children: [{ name: "user.prisma", type: "file" }, ...(hasJwt ? [{ name: "token.prisma", type: "file" }] : [])],
							},
							{
								name: "enums",
								type: "directory",
								children: [{ name: "common.prisma", type: "file" }],
							},
							{ name: "seed.ts", type: "file" },
						],
					} as FileType,
				]
			: []),
		{ name: "src", type: "directory", children: srcChildren },
		{
			name: "tests",
			type: "directory",
			children: [
				{
					name: "unit",
					type: "directory",
					children: [{ name: "index.ts", type: "file" }],
				},
				{
					name: "integration",
					type: "directory",
					children: [{ name: "index.ts", type: "file" }],
				},
				{
					name: "e2e",
					type: "directory",
					children: [{ name: "index.ts", type: "file" }],
				},
			],
		},
	];

	const baseStructure: FileType[] = [
		{
			name: projectName,
			type: "directory",
			children: rootChildren,
		},
	];

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

export const countTreeNodes = (nodes: FileType[]): { files: number; directories: number } => {
	let files = 0;
	let directories = 0;

	const traverse = (items: FileType[]) => {
		for (const item of items) {
			if (item.type === "directory") {
				directories += 1;
				if (item.children) traverse(item.children);
			} else {
				files += 1;
			}
		}
	};

	traverse(nodes);
	return { files, directories };
};

const resolveTemplateKeyForRelativePath = (relativePath: string, activeOrm: string): string | null => {
	// Root files
	const rootMap: Record<string, string> = {
		".env": "root/env.ejs",
		".gitignore": "root/gitignore.ejs",
		"biome.json": "root/biome.json.ejs",
		"tsconfig.json": "root/tsconfig.json.ejs",
		"README.md": "root/readme.md.ejs",
		".dockerignore": "root/dockerignore.ejs",
		Dockerfile: "root/dockerfile.ejs",
		"docker-compose.yml": "root/docker-compose.yml.ejs",
		"drizzle.config.ts": "infrastructure/database/drizzle/drizzle.config.ts.ejs",
		"prisma.config.ts": "infrastructure/database/prisma/prisma.config.ts.ejs",
		"src/index.ts": "root/index.ts.ejs",
	};

	if (rootMap[relativePath]) {
		return rootMap[relativePath];
	}

	// Prisma root directory files
	const prismaMap: Record<string, string> = {
		"prisma/schema.prisma": "infrastructure/database/prisma/schema.prisma.ejs",
		"prisma/models/user.prisma": "infrastructure/database/prisma/models/user.prisma.ejs",
		"prisma/models/token.prisma": "infrastructure/database/prisma/models/token.prisma.ejs",
		"prisma/enums/common.prisma": "infrastructure/database/prisma/enums/common.prisma.ejs",
		"prisma/seed.ts": "infrastructure/database/prisma/seed.ts.ejs",
	};

	if (prismaMap[relativePath]) {
		return prismaMap[relativePath];
	}

	// Infrastructure database files
	if (relativePath === "src/infrastructure/database/index.ts") {
		if (activeOrm === "prisma") return "infrastructure/database/prisma/client.ts.ejs";
		if (activeOrm === "mongoose") return "infrastructure/database/mongoose/connection.ts.ejs";
		return "infrastructure/database/drizzle/index.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/seed.ts") {
		if (activeOrm === "mongoose") return "infrastructure/database/mongoose/seed.ts.ejs";
		return "infrastructure/database/drizzle/seed.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/schema.ts") {
		return "infrastructure/database/drizzle/schema.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/schema/user.schema.ts") {
		return "infrastructure/database/drizzle/user.schema.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/schema/token.schema.ts") {
		return "infrastructure/database/drizzle/token.schema.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/models/user.model.ts") {
		return "infrastructure/database/mongoose/user.model.ts.ejs";
	}

	if (relativePath === "src/infrastructure/database/models/token.model.ts") {
		return "infrastructure/database/mongoose/token.model.ts.ejs";
	}

	// Generic src/* files map directly to `<path-without-src/>.ejs`
	if (relativePath.startsWith("src/")) {
		const stripped = relativePath.slice(4); // remove "src/"
		return `${stripped}.ejs`;
	}

	return null;
};

const detectLanguage = (relativePath: string): string => {
	if (relativePath.endsWith(".json")) return "json";
	if (relativePath.endsWith(".md")) return "markdown";
	if (relativePath.endsWith(".yml") || relativePath.endsWith(".yaml")) return "yaml";
	if (relativePath.endsWith(".prisma")) return "prisma";
	if (relativePath === "Dockerfile") return "dockerfile";
	if (relativePath.startsWith(".")) return "env / config";
	return "typescript";
};

export const getFilePreviewContent = (
	filePath: string,
	{ name, framework, orm, features = [], auth, database }: ProjectConfig & { database?: string },
): { language: string; code: string; description: string } => {
	const projectName = name || "my-app";
	const fw = framework || "express";
	const db = database || (orm === "mongoose" ? "mongodb" : "postgres");
	const activeOrm = orm || (db === "mongodb" ? "mongoose" : "drizzle");
	const activeAuth = auth === "jwt" || auth === "jwt-auth" ? "jwt" : "none";

	// Strip `<projectName>/` prefix to get the project-relative path
	const slashIndex = filePath.indexOf("/");
	const relativePath = slashIndex !== -1 ? filePath.slice(slashIndex + 1) : filePath;
	const language = detectLanguage(relativePath);

	// 1. package.json
	if (relativePath === "package.json") {
		return {
			language: "json",
			description: `Generated package.json for ${projectName} (${fw} + ${db} + ${activeOrm}).`,
			code: generatePackageJsonString({
				projectName,
				framework: fw,
				database: db,
				orm: activeOrm,
				auth: activeAuth,
			}),
		};
	}

	// 2. Test placeholder files (created directly in create-project-structure.ts)
	if (relativePath === "tests/unit/index.ts") {
		return {
			language: "typescript",
			description: "Unit test suite entry file.",
			code: "// Unit tests\n// Place unit tests for isolated functions, services, and modules here.\n",
		};
	}
	if (relativePath === "tests/integration/index.ts") {
		return {
			language: "typescript",
			description: "Integration test suite entry file.",
			code: "// Integration tests\n// Place integration tests for API routes, database queries, and middleware here.\n",
		};
	}
	if (relativePath === "tests/e2e/index.ts") {
		return {
			language: "typescript",
			description: "End-to-end (E2E) test suite entry file.",
			code: "// End-to-end (E2E) tests\n// Place end-to-end scenario and full system workflow tests here.\n",
		};
	}

	// 3. Resolve & render actual .ejs template
	const templateKey = resolveTemplateKeyForRelativePath(relativePath, activeOrm);
	const rawTemplate = templateKey ? templateStore[templateKey] : undefined;

	if (rawTemplate) {
		try {
			const rendered = renderEjsTemplate(rawTemplate, {
				projectName,
				framework: fw,
				database: db,
				orm: activeOrm,
				auth: activeAuth,
				features,
				pkgManager: "npm",
				pkgLock: "package-lock.json",
				nodeVersion: "22",
				pgVersion: "16",
				mysqlVersion: "8",
				mongoVersion: "7",
			});

			return {
				language,
				description: `Scaffolded from template/${templateKey}`,
				code: rendered,
			};
		} catch {
			return {
				language,
				description: `Template preview (${relativePath})`,
				code: rawTemplate,
			};
		}
	}

	return {
		language,
		description: `Generated file (${relativePath})`,
		code: `// ${relativePath}\n`,
	};
};
