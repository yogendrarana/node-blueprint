import logger from "../config/logger.js";
import type { NextFunction, Request, Response } from "express";

const ErrorMiddleware = (err: any, _req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 500;
	err.message = err.message || "Internal Server Error";

    logger.error(err.message);

    res.status(err.status).json({
        success: false,
        message: err.message
    });
}

export default ErrorMiddleware;