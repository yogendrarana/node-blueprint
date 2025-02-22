import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, json, errors, colorize } = winston.format;

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const level = () => {
    const env = process.env.NODE_ENV || 'dev';
    return (env === 'prod' || env === 'production') ? 'info' : 'debug';
};

const errorLogsTransport = new winston.transports.DailyRotateFile({
    filename: 'winston-logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '180d',
    level: 'error'
});

const allLogsTransport = new DailyRotateFile({
    filename: 'winston-logs/all-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '180d'
});

const WinstonLogger = winston.createLogger({
    level: level(),
    levels,
    format: combine(
        timestamp(),
        json(),
        colorize(),
        errors({ stack: true }),
    ),
    transports: [
        new winston.transports.Console(),
        allLogsTransport,
        errorLogsTransport
    ]
});

export default WinstonLogger;