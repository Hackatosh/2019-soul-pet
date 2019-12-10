/*** This file mounts middlewares and the routers created in controllers into the express application ***/

import express, {Router, Response} from 'express';
import helmet from 'helmet';
import { healthRouter } from './controllers/health';
import {loginRequiredMW} from "./middlewares/loginRequired";
import {authenticationRouter} from "./controllers/authentication";
import {AuthenticatedRequest} from "../core/authentication/authenticationInterfaces";
import * as bodyParser from 'body-parser';
import {uploadRouter} from "./controllers/upload";
import {handleError500MW} from "./middlewares/errorHandlers";
import {logoutRouter} from "./controllers/logout";
import {allowFrontMW} from "./middlewares/allowFront";
import {animalsRouter} from "./controllers/animals";
import {eventsRouter} from "./controllers/events";

/*** Basic middlewares mouting ***/
const app = express();

app.use(allowFrontMW);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

/*** API routers mounting ***/
const apiRouter = Router();
apiRouter.use('/', healthRouter);
apiRouter.use('/files',uploadRouter);
apiRouter.use('/auth',authenticationRouter);
apiRouter.use('*',loginRequiredMW);
apiRouter.use('/events',eventsRouter);
apiRouter.use('/animals',animalsRouter);
apiRouter.use('/logout',logoutRouter);
apiRouter.use('*',handleError500MW);

app.use('/api', apiRouter);

export { app };
