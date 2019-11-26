import { app } from './routes/app';
import http from 'http';
import {env} from './config/env'

app.set('port', env.SERVER_PORT);

const server = http.createServer(app);
server.on('listening', () => {
    console.log(`Listening on port ${env.SERVER_PORT}`);
});
server.listen(env.SERVER_PORT);