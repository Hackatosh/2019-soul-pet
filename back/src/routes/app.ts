import express, {Router, Response} from 'express';
import { healthRouter } from './controllers/health';
import {loginRequiredMW} from "./middlewares/loginRequired";
import {authenticationRouter} from "./controllers/authentication";
import {AuthenticatedRequest} from "../core/authenticationInterfaces";
import * as bodyParser from "body-parser";

const app = express();
const apiRouter = Router();

app.use(function (_, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
apiRouter.use('/', healthRouter);
apiRouter.use('/auth',authenticationRouter);
apiRouter.use('*',loginRequiredMW);
apiRouter.use('/protected',(req:AuthenticatedRequest,res:Response) => {res.status(200).json({message:`Welcome ${req.user.username}`})});

app.use('/api', apiRouter);

export { app };
