import { app } from './app';
import http from 'http';

const port = 3000;

app.set('port', port);

const server = http.createServer(app);
server.on('listening', () => {
    console.log(`Listening on port ${port}`);
});
server.listen(port);