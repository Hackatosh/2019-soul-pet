/**
 * This files defines a logger which can be used through the whole application.
 * In development environment, the LOG_IN_FILE env variable is usually set to false.
 * This leads the logger to just act as console.log would.
 * In production environment, the LOG_IN_FILE env variable must be set to true.
 * It allows logs to be written in log files, which make them usable in production environment.
 ***/

import {env} from "../config/env";

const winston = require('winston');

const winstonLogger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            json: false,
        }),
        new (winston.transports.File)({
            name: 'info-file',
            level: 'info',
            filename: './logs/info.log',
            json: false,
            datePattern: 'yyyy-MM-dd-',
            prepend: true,
        }),
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
    function (info: string): void {
        winstonLogger.info(info);
    }
    :
    console.log;

const logError = env.LOG_IN_FILE ?
    function (err: string): void {
        winstonLogger.error(err);
    }
    :
    console.log;

const logger = {info: logInfo, error: logError};

export {logger};