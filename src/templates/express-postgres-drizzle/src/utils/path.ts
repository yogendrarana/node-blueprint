import path from "path";
import { fileURLToPath } from "url";

export function getDirname(metaUrl: string) {
    const filename = fileURLToPath(metaUrl);
    return path.dirname(filename);
}
