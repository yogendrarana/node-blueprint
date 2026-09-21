import type { ProjectConfig } from "../types/types.js";
import { readTemplateFile } from "../utils/utils.js";

export type TemplaterKey = "root" | "app" | "modules" | "infrastructure" | "shared";
export type TemplaterFunctionType = (options: ProjectConfig | Record<string, unknown>) => Promise<string>;

export interface ITemplateConfig {
	name: string;
	templater: Record<string, TemplaterFunctionType>;
}

export const TemplaterMap: Record<TemplaterKey, ITemplateConfig> = {
	// Root files
	root: {
		name: "root",
		templater: {
			index: (options) => readTemplateFile("root/index.ts.ejs", options),
			env: (options) => readTemplateFile("root/env.ejs", options),
			gitignore: (options) => readTemplateFile("root/gitignore.ejs", options),
			tsconfig: (options) => readTemplateFile("root/tsconfig.json.ejs", options),
			readme: (options) => readTemplateFile("root/readme.md.ejs", options),
			dockerfile: (options) => readTemplateFile("root/dockerfile.ejs", options),
			dockerComposeYml: (options) => readTemplateFile("root/docker-compose.yml.ejs", options),
			dockerignore: (options) => readTemplateFile("root/dockerignore.ejs", options),
			biome: (options) => readTemplateFile("root/biome.json.ejs", options),
		},
	},

	// App layer
	app: {
		name: "app",
		templater: {
			envConfig: (options) => readTemplateFile("app/config/env.ts.ejs", options),
			corsConfig: (options) => readTemplateFile("app/config/cors.ts.ejs", options),
			loggerConfig: (options) => readTemplateFile("app/config/logger.ts.ejs", options),
			server: (options) => readTemplateFile("app/http/server.ts.ejs", options),
			app: (options) => readTemplateFile("app/http/app.ts.ejs", options),
			corsMiddleware: (options) => readTemplateFile("app/http/middleware/cors.middleware.ts.ejs", options),
			errorMiddleware: (options) => readTemplateFile("app/http/middleware/error.middleware.ts.ejs", options),
			helmetMiddleware: (options) => readTemplateFile("app/http/middleware/helmet.middleware.ts.ejs", options),
			routes: (options) => readTemplateFile("app/routes.ts.ejs", options),
		},
	},

	// Modules layer
	modules: {
		name: "modules",
		templater: {
			healthRoutes: (options) => readTemplateFile("modules/health/health.routes.ts.ejs", options),
			healthController: (options) => readTemplateFile("modules/health/health.controller.ts.ejs", options),
			userRoutes: (options) => readTemplateFile("modules/users/user.routes.ts.ejs", options),
			userController: (options) => readTemplateFile("modules/users/user.controller.ts.ejs", options),
			userRepo: (options) => readTemplateFile("modules/users/user.repo.ts.ejs", options),
			userTypes: (options) => readTemplateFile("modules/users/user.types.ts.ejs", options),
			authRoutes: (options) => readTemplateFile("modules/auth/auth.routes.ts.ejs", options),
			authController: (options) => readTemplateFile("modules/auth/auth.controller.ts.ejs", options),
			authService: (options) => readTemplateFile("modules/auth/auth.service.ts.ejs", options),
			authSchema: (options) => readTemplateFile("modules/auth/auth.schema.ts.ejs", options),
			authTypes: (options) => readTemplateFile("modules/auth/auth.types.ts.ejs", options),
		},
	},

	// Infrastructure layer
	infrastructure: {
		name: "infrastructure",
		templater: {
			// Drizzle
			drizzleIndex: (options) => readTemplateFile("infrastructure/database/drizzle/index.ts.ejs", options),
			drizzleSchema: (options) => readTemplateFile("infrastructure/database/drizzle/schema.ts.ejs", options),
			drizzleUserSchema: (options) => readTemplateFile("infrastructure/database/drizzle/user.schema.ts.ejs", options),
			drizzleTokenSchema: (options) => readTemplateFile("infrastructure/database/drizzle/token.schema.ts.ejs", options),
			drizzleSeed: (options) => readTemplateFile("infrastructure/database/drizzle/seed.ts.ejs", options),
			drizzleConfig: (options) => readTemplateFile("infrastructure/database/drizzle/drizzle.config.ts.ejs", options),
			// Prisma
			prismaClient: (options) => readTemplateFile("infrastructure/database/prisma/client.ts.ejs", options),
			prismaSchema: (options) => readTemplateFile("infrastructure/database/prisma/schema.prisma.ejs", options),
			prismaSeed: (options) => readTemplateFile("infrastructure/database/prisma/seed.ts.ejs", options),
			// Mongoose
			mongooseConnection: (options) => readTemplateFile("infrastructure/database/mongoose/connection.ts.ejs", options),
			mongooseUserModel: (options) => readTemplateFile("infrastructure/database/mongoose/user.model.ts.ejs", options),
			mongooseTokenModel: (options) => readTemplateFile("infrastructure/database/mongoose/token.model.ts.ejs", options),
			mongooseSeed: (options) => readTemplateFile("infrastructure/database/mongoose/seed.ts.ejs", options),
			// Stubs
			cacheIndex: (options) => readTemplateFile("infrastructure/cache/index.ts.ejs", options),
			queueIndex: (options) => readTemplateFile("infrastructure/queue/index.ts.ejs", options),
			storageIndex: (options) => readTemplateFile("infrastructure/storage/index.ts.ejs", options),
			mailIndex: (options) => readTemplateFile("infrastructure/mail/index.ts.ejs", options),
			paymentsIndex: (options) => readTemplateFile("infrastructure/payments/index.ts.ejs", options),
		},
	},

	// Shared layer
	shared: {
		name: "shared",
		templater: {
			appError: (options) => readTemplateFile("shared/errors/app-error.ts.ejs", options),
			errorCodes: (options) => readTemplateFile("shared/errors/error-codes.ts.ejs", options),
			pagination: (options) => readTemplateFile("shared/utils/pagination.ts.ejs", options),
			dates: (options) => readTemplateFile("shared/utils/dates.ts.ejs", options),
			commonTypes: (options) => readTemplateFile("shared/types/common.ts.ejs", options),
			rolesConstant: (options) => readTemplateFile("shared/constants/roles.ts.ejs", options),
			tokensConstant: (options) => readTemplateFile("shared/constants/tokens.ts.ejs", options),
			constants: (options) => readTemplateFile("shared/constants/index.ts.ejs", options),
		},
	},
};
