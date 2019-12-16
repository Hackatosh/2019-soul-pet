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
