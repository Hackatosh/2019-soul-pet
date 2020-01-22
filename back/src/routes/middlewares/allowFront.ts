/***
 * This files defines a middleware that allows Cross-Origin requests (CORS) from the React Application served by the yarn development server.
 * Please note that this could be avoided in production by serving the front-end files and the API from the same server.
 ***/

import {CorsOptions} from "cors";
import cors from "cors";

const corsOptions:CorsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders:  ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

const corsMW = cors(corsOptions);

export { corsMW }
