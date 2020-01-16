/*** This file mounts middlewares and the routers created in controllers into the express application ***/

import express, {Router, Response} from 'express';
import helmet from 'helmet';
import { healthRouter } from './controllers/health';
import {loginRequiredMW} from "./middlewares/loginRequired";
import {authenticationRouter} from "./controllers/authentication";
import * as bodyParser from 'body-parser';
import {animalPicturesRouter} from "./controllers/animalPictures";
import {handleError500MW} from "./middlewares/errorHandlers";
import {logoutRouter} from "./controllers/logout";
import {corsMW} from "./middlewares/allowFront";
import {animalsRouter} from "./controllers/animals";
import {accountRouter} from "./controllers/account";
import {eventsRouter} from "./controllers/events";
import {uploadTestRouter} from "./controllers/upload";
import {placesRouter} from "./controllers/places";
import {eventCommentsRouter} from "./controllers/eventComments";

/*** Basic middlewares mouting ***/
const app = express();

app.use(corsMW);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

/*** API routers mounting ***/
const apiRouter = Router();
apiRouter.use('/', healthRouter);
apiRouter.use('/auth',authenticationRouter);
apiRouter.use('*',loginRequiredMW);
apiRouter.use('/places', placesRouter);
apiRouter.use('/events',eventsRouter);
apiRouter.use('/comments',eventCommentsRouter);
apiRouter.use('/account',accountRouter);
apiRouter.use('/animals',animalsRouter);
apiRouter.use('/uploadTest',uploadTestRouter);
apiRouter.use('/pictures/animals',animalPicturesRouter);
apiRouter.use('/logout',logoutRouter);
apiRouter.use('*',handleError500MW);

app.use('/api', apiRouter);

export { app };