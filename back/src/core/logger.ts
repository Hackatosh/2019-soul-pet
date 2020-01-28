/**
 * Configurations of logger.
 */
import {env} from "../config/env";

const winston = require('winston');

const winstonLogger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            json:false,
        }),
        new (winston.transports.File)({
            name: 'info-file',
            level: 'info',
            filename: './logs/info.log',
            json: false,
            datePattern: 'yyyy-MM-dd-',
            prepend: true, }),
        new (winston.transports.File)({
            name: 'error-file',
            level: 'error',
            filename: './logs/error.log',
            json: false,
            datePattern: 'yyyy-MM-dd-',
            prepend: true,
        })
    ]
});

const logInfo = env.LOG_IN_FILE ?
    function (info: string) {
        winstonLogger.info(info);
    }
    :
    console.log;

const logError = env.LOG_IN_FILE ?
    function (err: string) {
        winstonLogger.error(err);
    }
    :
    console.log;

const logger = {info: logInfo, error: logError};

export {logger};