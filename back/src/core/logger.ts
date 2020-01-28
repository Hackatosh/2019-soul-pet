/**
 * Configurations of logger.
 */
import {env} from "../config/env";

const winston = require('winston');

const consoleConfig = [
    new winston.transports.Console({
        'colorize': true
    })
];

const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const infoLogger = createLogger;
infoLogger.add({
    'name': 'info-file',
    'level': 'info',
    'filename': './logs/info.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true,
});

const errorLogger = createLogger;
errorLogger.add({
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true,
});

const logInfo = env.LOG_IN_FILE ?
    function (info: string) {
        infoLogger.info(info);
    }
    :
    console.log;

const logError = env.LOG_IN_FILE ?
    function (err: string) {
        errorLogger.error(err);
    }
    :
    console.log;

const logger = {info: logInfo, error: logError};

export {logger};