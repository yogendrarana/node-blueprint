import morgan from "morgan";
import winstonLogger from "../config/logger/logger.js";

const stream = {
    write: (message: string) => winstonLogger.http(message),
};

const MorganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });

export default MorganMiddleware;