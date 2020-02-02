/***
 * This file mounts the middlewares and the routers created in the controller files into the express application.
 ***/

import express, {Router, Response} from 'express';
import helmet from 'helmet';
import {healthRouter} from './controllers/health';
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
import {placesRouter} from "./controllers/places";
import {eventCommentsRouter} from "./controllers/eventComments";
import {eventPicturesRouter} from "./controllers/eventPictures";

/***
 * Express application creation and common middleware mounting.
 ***/

const app = express();
app.use(corsMW);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

/***
 * API router creation and unauthenticated API routes mounting.
 ***/

const apiRouter = Router();
apiRouter.use('/', healthRouter);
apiRouter.use('/auth', authenticationRouter);

/***
 * Authenticated API routes mounting.
 ***/

apiRouter.use('*', loginRequiredMW);
apiRouter.use('/places', placesRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/comments', eventCommentsRouter);
apiRouter.use('/accounts', accountRouter);
apiRouter.use('/animals', animalsRouter);
apiRouter.use('/pictures/animals', animalPicturesRouter);
apiRouter.use('/pictures/events', eventPicturesRouter);
apiRouter.use('/logout', logoutRouter);

/***
 * Error handling middleware mounting.
 ***/

apiRouter.use('*', handleError500MW);

/***
 * API router mounting into Express application.
 ***/

app.use('/api', apiRouter);

export {app};