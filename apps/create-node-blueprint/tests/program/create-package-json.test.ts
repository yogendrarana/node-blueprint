import path from 'path';
import fs from 'fs-extra';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { ProjectConfig } from '../../src/types/types.js';
import { createPackageJson } from '../../src/program/create-package-json.js';
import { createTempDir, cleanupTempDir, readJsonFile } from '../utils/test-helpers.js';
import { AuthEnum, DatabaseEnum, FrameworkEnum, OrmEnum } from '../../src/enums/enums.js';

describe('Package.json Generation', () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await createTempDir('pkg-test-');
    });

    afterEach(async () => {
        await cleanupTempDir(tempDir);
    });

    it('should create package.json with basic structure', async () => {
        const config: ProjectConfig = {
            projectName: 'test-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.drizzle,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJsonPath = path.join(tempDir, 'package.json');
        expect(await fs.pathExists(packageJsonPath)).toBe(true);

        const packageJson = await readJsonFile(packageJsonPath);
        expect(packageJson.name).toBe('test-app');
        expect(packageJson.type).toBe('module');
        expect(packageJson.main).toBe('dist/server.js');
    });

    it('should include Express dependencies', async () => {
        const config: ProjectConfig = {
            projectName: 'express-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.drizzle,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(packageJson.dependencies).toHaveProperty('express');
        expect(packageJson.dependencies).toHaveProperty('cors');
        expect(packageJson.dependencies).toHaveProperty('helmet');
        expect(packageJson.dependencies).toHaveProperty('winston');
        expect(packageJson.devDependencies).toHaveProperty('@types/express');
    });

    it('should include Drizzle ORM dependencies and scripts', async () => {
        const config: ProjectConfig = {
            projectName: 'drizzle-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.drizzle,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(packageJson.dependencies).toHaveProperty('drizzle-orm');
        expect(packageJson.devDependencies).toHaveProperty('drizzle-kit');
        expect(packageJson.scripts).toHaveProperty('db:generate');
        expect(packageJson.scripts).toHaveProperty('db:push');
        expect(packageJson.scripts).toHaveProperty('db:studio');
    });

    it('should include Prisma ORM dependencies and scripts', async () => {
        const config: ProjectConfig = {
            projectName: 'prisma-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.prisma,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(packageJson.dependencies).toHaveProperty('@prisma/client');
        expect(packageJson.devDependencies).toHaveProperty('prisma');
        expect(packageJson.scripts).toHaveProperty('db:generate');
        expect(packageJson.scripts).toHaveProperty('db:migrate');
        expect(packageJson.scripts).toHaveProperty('db:studio');
    });

    it('should include Mongoose dependencies for MongoDB', async () => {
        const config: ProjectConfig = {
            projectName: 'mongoose-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.mongodb,
            orm: OrmEnum.mongoose,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(packageJson.dependencies).toHaveProperty('mongoose');
        expect(packageJson.devDependencies).toHaveProperty('@types/mongoose');
    });

    it('should include JWT auth dependencies when selected', async () => {
        const config: ProjectConfig = {
            projectName: 'auth-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.drizzle,
            auth: AuthEnum.jwtAuth,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(config, { root: tempDir, pkgManager: 'npm' });

        const packageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(packageJson.dependencies).toHaveProperty('jsonwebtoken');
        expect(packageJson.dependencies).toHaveProperty('bcrypt');
        expect(packageJson.devDependencies).toHaveProperty('@types/jsonwebtoken');
        expect(packageJson.devDependencies).toHaveProperty('@types/bcrypt');
    });

    it('should include database-specific dependencies', async () => {
        const postgresConfig: ProjectConfig = {
            projectName: 'postgres-app',
            framework: FrameworkEnum.express,
            database: DatabaseEnum.postgres,
            orm: OrmEnum.drizzle,
            auth: AuthEnum.none,
            features: [],
            installDependencies: false,
            initializeGit: false
        };

        await createPackageJson(postgresConfig, { root: tempDir, pkgManager: 'npm' });
        const pgPackageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(pgPackageJson.dependencies).toHaveProperty('pg');
        expect(pgPackageJson.devDependencies).toHaveProperty('@types/pg');

        await cleanupTempDir(tempDir);
        tempDir = await createTempDir('pkg-test-');

        const mysqlConfig: ProjectConfig = {
            ...postgresConfig,
            database: DatabaseEnum.mysql
        };

        await createPackageJson(mysqlConfig, { root: tempDir, pkgManager: 'npm' });
        const mysqlPackageJson = await readJsonFile(path.join(tempDir, 'package.json'));
        expect(mysqlPackageJson.dependencies).toHaveProperty('mysql2');
    });
});
