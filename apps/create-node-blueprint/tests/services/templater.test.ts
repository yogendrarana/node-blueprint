import { describe, it, expect } from 'vitest';
import { TemplaterMap } from '../../src/services/templater.js';
import { AuthEnum, DatabaseEnum, FrameworkEnum, OrmEnum } from '../../src/enums/enums.js';
import type { ProjectConfig } from '../../src/types/types.js';

describe('Templater Service', () => {
    const mockConfig: ProjectConfig = {
        projectName: 'test-project',
        framework: FrameworkEnum.express,
        database: DatabaseEnum.postgres,
        orm: OrmEnum.drizzle,
        auth: AuthEnum.jwtAuth,
        features: ['docker'],
        installDependencies: false,
        initializeGit: false
    };

    describe('Base Templates', () => {
        it('should generate .env file', async () => {
            const content = await TemplaterMap.base.templater.env(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('PORT');
            expect(content).toContain('DATABASE_URL');
        });

        it('should generate .gitignore file', async () => {
            const content = await TemplaterMap.base.templater.gitignore(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('node_modules');
            expect(content).toContain('.env');
        });

        it('should generate tsconfig.json', async () => {
            const content = await TemplaterMap.base.templater.tsconfig(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('compilerOptions');
        });

        it('should generate README.md', async () => {
            const content = await TemplaterMap.base.templater.readme(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('node-blueprint');
        });
    });

    describe('Common Templates', () => {
        it('should generate server.ts', async () => {
            const content = await TemplaterMap.common.templater.serverTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('http.createServer');
        });

        it('should generate app.ts', async () => {
            const content = await TemplaterMap.common.templater.appTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('express');
        });

        it('should generate router.ts', async () => {
            const content = await TemplaterMap.common.templater.routerTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('Router');
        });
    });

    describe('Express Framework Templates', () => {
        it('should generate logger.ts', async () => {
            const content = await TemplaterMap.express.templater.loggerTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('winston');
        });

        it('should generate error-middleware.ts', async () => {
            const content = await TemplaterMap.express.templater.errorMiddlewareTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('HttpError');
        });

        it('should generate cors.ts', async () => {
            const content = await TemplaterMap.express.templater.corsTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('cors');
        });
    });

    describe('Drizzle ORM Templates', () => {
        it('should generate drizzle.config.ts', async () => {
            const content = await TemplaterMap.drizzle.templater.drizzleConfig(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('drizzle');
        });

        it('should generate index.ts', async () => {
            const content = await TemplaterMap.drizzle.templater.indexTs(mockConfig);
            expect(content).toBeTruthy();
        });

        it('should generate user-schema.ts', async () => {
            const content = await TemplaterMap.drizzle.templater.userSchemaTs(mockConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('pgTable');
        });
    });

    describe('Prisma ORM Templates', () => {
        it('should generate schema.prisma', async () => {
            const prismaConfig = { ...mockConfig, orm: OrmEnum.prisma };
            const content = await TemplaterMap.prisma.templater.schemaPrisma(prismaConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('datasource');
            expect(content).toContain('generator');
        });

        it('should generate prisma-client.ts', async () => {
            const prismaConfig = { ...mockConfig, orm: OrmEnum.prisma };
            const content = await TemplaterMap.prisma.templater.prismaClientTs(prismaConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('PrismaClient');
        });
    });

    describe('Mongoose ORM Templates', () => {
        it('should generate user-model.ts', async () => {
            const mongooseConfig = { 
                ...mockConfig, 
                orm: OrmEnum.mongoose,
                database: DatabaseEnum.mongodb 
            };
            const content = await TemplaterMap.mongoose.templater.userModelTs(mongooseConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('mongoose');
        });

        it('should generate db.ts', async () => {
            const mongooseConfig = { 
                ...mockConfig, 
                orm: OrmEnum.mongoose,
                database: DatabaseEnum.mongodb 
            };
            const content = await TemplaterMap.mongoose.templater.dbTs(mongooseConfig);
            expect(content).toBeTruthy();
            expect(content).toContain('mongoose');
        });
    });
});
