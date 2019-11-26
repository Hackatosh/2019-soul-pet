import express, {Router, Response} from 'express';
import { healthRouter } from './controllers/health';
import {loginRequiredMW} from "./middlewares/loginRequired";
import {authenticationRouter} from "./controllers/authentication";
import {AuthenticatedRequest} from "../core/authenticationInterfaces";

const app = express();
const apiRouter = Router();

apiRouter.use('/', healthRouter);
apiRouter.use('/auth',authenticationRouter);
apiRouter.use('*',loginRequiredMW);
apiRouter.use('/protected',(req:AuthenticatedRequest,res:Response) => {res.status(200).json({message:`Welcome ${req.user.username}`})});

app.use('/api', apiRouter);

export { app };
