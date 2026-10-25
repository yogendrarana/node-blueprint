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

export const getFilePreviewContent = (
	filePath: string,
	{ name, framework, orm, features = [], auth, database }: ProjectConfig & { database?: string },
): { language: string; code: string; description: string } => {
	const projectName = name || "my-app";
	const fw = framework || "express";
	const db = database || (orm === "mongoose" ? "mongodb" : "postgres");
	const activeOrm = orm || (db === "mongodb" ? "mongoose" : "drizzle");
	const hasJwt = auth === "jwt" || auth === "jwt-auth";
	const hasDocker = features.includes("docker");

	const fileName = filePath.split("/").pop() || "index.ts";

	if (fileName === "package.json") {
		const deps: Record<string, string> = {
			...(fw === "fastify"
				? { fastify: "^5.2.0", "@fastify/cors": "^10.0.1", "@fastify/helmet": "^13.0.0" }
				: { express: "^5.0.1", cors: "^2.8.5", helmet: "^8.0.0", pino: "^9.6.0" }),
			...(activeOrm === "drizzle" ? { "drizzle-orm": "^0.39.0" } : {}),
			...(activeOrm === "prisma" ? { "@prisma/client": "^6.3.0" } : {}),
			...(activeOrm === "mongoose" ? { mongoose: "^8.10.0" } : {}),
			...(db === "postgres" && activeOrm !== "mongoose" ? { pg: "^8.13.3" } : {}),
			...(db === "mysql" && activeOrm !== "mongoose" ? { mysql2: "^3.12.0" } : {}),
			...(hasJwt ? { jsonwebtoken: "^9.0.2", bcryptjs: "^3.0.2" } : {}),
			dotenv: "^16.4.7",
			zod: "^3.24.2",
		};

		return {
			language: "json",
			description: "Generated workspace manifest with zero-config scripts and strict ESM.",
			code: JSON.stringify(
				{
					name: projectName,
					version: "0.1.0",
					private: true,
					type: "module",
					scripts: {
						dev: "tsx watch src/index.ts",
						build: "tsc -b",
						start: "node dist/index.js",
						check: "biome check --write .",
						...(activeOrm === "drizzle" ? { "db:generate": "drizzle-kit generate", "db:migrate": "drizzle-kit migrate" } : {}),
						...(activeOrm === "prisma" ? { "db:generate": "prisma generate", "db:push": "prisma db push" } : {}),
					},
					dependencies: deps,
				},
				null,
				2,
			),
		};
	}

	if (fileName === "server.ts" || fileName === "app.ts" || filePath.endsWith("src/index.ts")) {
		if (fw === "fastify") {
			return {
				language: "typescript",
				description: "Fastify HTTP server bootstrap with structured logging & graceful shutdown.",
				code: `import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { env } from "@/app/config/env";
import { registerRoutes } from "@/app/routes";

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(helmet);
  await app.register(cors, { origin: env.CORS_ORIGIN });
  await registerRoutes(app);

  return app;
}

const start = async () => {
  const server = await buildServer();
  await server.listen({ port: env.PORT, host: "0.0.0.0" });
};

start();`,
			};
		}

		return {
			language: "typescript",
			description: "Express HTTP application layer with security middleware & clean route mounting.",
			code: `import express from "express";
import { env } from "@/app/config/env";
import { logger } from "@/app/config/logger";
import { corsMiddleware } from "@/app/http/middleware/cors.middleware";
import { helmetMiddleware } from "@/app/http/middleware/helmet.middleware";
import { errorMiddleware } from "@/app/http/middleware/error.middleware";
import { apiRouter } from "@/app/routes";

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/v1", apiRouter);
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  logger.info(\`[${projectName}] Server listening on port \${env.PORT}\`);
});`,
		};
	}

	if (
		fileName.includes("schema") ||
		fileName === "drizzle.config.ts" ||
		fileName.endsWith(".prisma") ||
		fileName.includes("model")
	) {
		if (activeOrm === "prisma") {
			return {
				language: "prisma",
				description: `Prisma multi-file schema configured for ${db.toUpperCase()}.`,
				code: `datasource db {
  provider = "${db === "mysql" ? "mysql" : "postgresql"}"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
			};
		}

		if (activeOrm === "mongoose") {
			return {
				language: "typescript",
				description: "Mongoose typed document schema with timestamps and indexes.",
				code: `import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model<UserDocument>("User", userSchema);`,
			};
		}

		return {
			language: "typescript",
			description: `Drizzle ORM type-safe ${db.toUpperCase()} table definition.`,
			code: `import { ${db === "mysql" ? "mysqlTable, varchar, timestamp" : "pgTable, uuid, text, timestamp"} } from "drizzle-orm/${db === "mysql" ? "mysql-core" : "pg-core"}";

export const users = ${db === "mysql" ? "mysqlTable" : "pgTable"}("users", {
  id: ${db === "mysql" ? 'varchar("id", { length: 36 }).primaryKey()' : 'uuid("id").defaultRandom().primaryKey()'},
  email: ${db === "mysql" ? 'varchar("email", { length: 255 }).notNull().unique()' : 'text("email").notNull().unique()'},
  name: ${db === "mysql" ? 'varchar("name", { length: 120 }).notNull()' : 'text("name").notNull()'},
  createdAt: timestamp("created_at").defaultNow().notNull(),
});`,
		};
	}

	if (fileName === "Dockerfile" || fileName === "docker-compose.yml") {
		return {
			language: "yaml",
			description: `Container orchestration for ${projectName} + ${db.toUpperCase()} service.`,
			code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - ${db}

  ${db}:
    image: ${db === "postgres" ? "postgres:17-alpine" : db === "mysql" ? "mysql:9.0" : "mongo:8.0"}
    restart: unless-stopped
    ports:
      - "${db === "postgres" ? "5432:5432" : db === "mysql" ? "3306:3306" : "27017:27017"}"`,
		};
	}

	if (filePath.includes("auth")) {
		return {
			language: "typescript",
			description: "Stateless JWT authentication service with access & refresh token rotation.",
			code: `import jwt from "jsonwebtoken";
import { env } from "@/app/config/env";
import { TOKEN_EXPIRY } from "@/shared/constants/tokens";

export class AuthService {
  static signTokens(payload: { sub: string; role: string }) {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: TOKEN_EXPIRY.ACCESS,
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: TOKEN_EXPIRY.REFRESH,
    });
    return { accessToken, refreshToken };
  }
}`,
		};
	}

	return {
		language: "typescript",
		description: `Clean architecture module (${fw.toUpperCase()} + ${activeOrm.toUpperCase()}${hasJwt ? " + JWT" : ""}${hasDocker ? " + Docker" : ""}).`,
		code: `// ${filePath}
import { AppError } from "@/shared/errors/app-error";
import { ERROR_CODES } from "@/shared/errors/error-codes";

export class ModuleController {
  async handleRequest(id: string) {
    if (!id) {
      throw new AppError("Resource identifier is required", ERROR_CODES.BAD_REQUEST, 400);
    }
    return {
      project: "${projectName}",
      framework: "${fw}",
      database: "${db}",
      orm: "${activeOrm}",
      status: "operational",
    };
  }
}`,
	};
};
