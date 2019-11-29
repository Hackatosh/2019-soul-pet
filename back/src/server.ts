import {app} from './routes/app';
import http from 'http';
import {env} from './config/env'
import {initDB} from "./database/connection";
import {testConnection} from "./core/upload/ftp";

const launchServer = async function () {
    try {
        await initDB();
        app.set('port', env.SERVER_PORT);
        const server = http.createServer(app);
        await server.listen(env.SERVER_PORT);
        console.log(`Listening on port ${env.SERVER_PORT}`);
    } catch (e) {
        console.log("CRITICAL ERROR WHILE STARTING SERVER !!!");
        console.log(e)
    }
};

//launchServer();
testConnection();