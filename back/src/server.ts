/***
 * This file defines the entrypoint of the application.
 * It represents the highest-level operations needed to launch the server.
 ***/

import {app} from './routes/app';
import http from 'http';
import {env} from './config/env'
import {initDB} from "./database/initDB";
import {logger} from "./core/logger";

const launchServer = async function () {
    try {
        await initDB();
        logger.info("Starting Server...");
        app.set('port', env.SERVER_PORT);
        const server = http.createServer(app);
        await server.listen(env.SERVER_PORT);
        logger.info(`Listening on port ${env.SERVER_PORT}`);
    } catch (e) {
        logger.error("CRITICAL ERROR WHILE STARTING SERVER !!!");
        logger.error(e)
    }
};

launchServer();