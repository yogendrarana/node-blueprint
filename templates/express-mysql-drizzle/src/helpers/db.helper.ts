import { APP_ENV } from "../constants/app-env.js";

export function getDbUrl() {
    if (process.env.NODE_ENV === APP_ENV.TEST) {
        return (
            process.env.TEST_DB_URL ||
            "postgresql://postgres:password@localhost:5432/node_api_test_db"
        );
    }
    return (
        process.env.DB_URL || 
        "postgresql://postgres:password@localhost:5432/node_api_dev_db"
    );
}
