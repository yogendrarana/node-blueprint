import { APP_ENV } from "../constants/app-env.js";

export function getDbUrl() {
    if (process.env.NODE_ENV === APP_ENV.TEST) {
        return process.env.TEST_DB_URL;
    }
    return process.env.DATABASE_URL;
}
