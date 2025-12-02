import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Creates a temporary test directory
 */
export async function createTempDir(prefix: string = 'test-'): Promise<string> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    return tempDir;
}

/**
 * Cleans up a test directory
 */
export async function cleanupTempDir(dirPath: string): Promise<void> {
    if (await fs.pathExists(dirPath)) {
        await fs.remove(dirPath);
    }
}

/**
 * Checks if a file exists and has content
 */
export async function fileExistsWithContent(filePath: string): Promise<boolean> {
    if (!(await fs.pathExists(filePath))) {
        return false;
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return content.length > 0;
}

/**
 * Reads a JSON file and returns parsed content
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
