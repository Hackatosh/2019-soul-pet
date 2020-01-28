/***
 * This file imports all the environment variables from process.env needed for the service.
 * It then performs test to ensure that they are correctly defined and export them through the env object.
 ***/

if (process.env.SERVER_PORT === undefined)
    require('dotenv').config();

const SERVER_PORT = process.env.SERVER_PORT;
const CORS_HOST = process.env.CORS_HOST;
const TOKEN_LIFETIME_SEC = process.env.TOKEN_LIFETIME_SEC;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const SECRET_KEY = process.env.SECRET_KEY;
const FTP_HOST = process.env.FTP_HOST;
const FTP_PORT = process.env.FTP_PORT;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_PATH_ANIMAL_PICTURES = process.env.FTP_PATH_ANIMAL_PICTURES;
const FTP_PATH_EVENT_PICTURES = process.env.FTP_PATH_EVENT_PICTURES;
const PLACES_API_ID = process.env.PLACES_API_ID;
const PLACES_API_SECRET = process.env.PLACES_API_SECRET;

if (SERVER_PORT == undefined || isNaN(parseInt(SERVER_PORT))) {
    throw new Error('SERVER_PORT is not a valid env variable');
}

if (CORS_HOST == undefined) {
    throw new Error('CORS_HOST is not a valid env variable');
}

if (TOKEN_LIFETIME_SEC == undefined || isNaN(parseInt(TOKEN_LIFETIME_SEC))) {
    throw new Error('TOKEN_LIFETIME_SEC is not a valid env variable');
}

if (DB_HOST == undefined) {
    throw new Error('DB_HOST is not a valid env variable');
}

if (DB_PORT == undefined || isNaN(parseInt(DB_PORT))) {
    throw new Error('DB_PORT is not a valid env variable');
}

if (DB_USER == undefined) {
    throw new Error('DB_USER is not a valid env variable');
}

if (DB_PASSWORD == undefined) {
    throw new Error('DB_PASSWORD is not a valid env variable');
}

if (DB_NAME == undefined) {
    throw new Error('DB_NAME is not a valid env variable');
}

if (SECRET_KEY == undefined) {
    throw new Error('SECRET_KEY is not a valid env variable');
}

if (FTP_HOST == undefined) {
    throw new Error('FTP_HOST is not a valid env variable');
}

if (FTP_PORT == undefined || isNaN(parseInt(DB_PORT))) {
    throw new Error('FTP_PORT is not a valid env variable');
}

if (FTP_USER == undefined) {
    throw new Error('FTP_USER is not a valid env variable');
}

if (FTP_PASSWORD == undefined) {
    throw new Error('FTP_PASSWORD is not a valid env variable');
}

if (FTP_PATH_ANIMAL_PICTURES == undefined) {
    throw new Error('FTP_PATH_ANIMAL_PICTURES is not a valid env variable');
}

if (FTP_PATH_EVENT_PICTURES == undefined) {
    throw new Error('FTP_PATH_EVENT_PICTURES is not a valid env variable');
}

if (PLACES_API_ID == undefined) {
    throw new Error('PLACES_API_ID is not a valid env variable');
}

if (PLACES_API_SECRET == undefined) {
    throw new Error('PLACES_API_SECRET is not a valid env variable');
}

const env = {
    SERVER_PORT,
    CORS_HOST,
    TOKEN_LIFETIME_SEC: parseInt(TOKEN_LIFETIME_SEC),
    DB_HOST,
    DB_PORT: parseInt(DB_PORT),
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    SECRET_KEY,
    FTP_HOST,
    FTP_PORT,
    FTP_USER,
    FTP_PASSWORD,
    FTP_PATH_ANIMAL_PICTURES,
    FTP_PATH_EVENT_PICTURES,
    PLACES_API_ID,
    PLACES_API_SECRET,
};

export {env};
