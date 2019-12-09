import {Request, Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {inputValidationMW} from "../middlewares/inputValidation";
import {User} from "../../database/models/user";
import {compareUserPassword} from "../../core/authentication/password";
import {generateTokenForUser} from "../../core/authentication/tokens";
import {authenticationRouter} from "./authentication";

const eventsRouter = Router();

/*** This route is used to create a new event ***/

eventsRouter.post('/', async (req:AuthenticatedRequest, res:Response) => {

});

/*** This route is used to get informations about an event ***/

eventsRouter.post('/:eventId', async (req:AuthenticatedRequest, res:Response) => {

});

/*** This route is used to add an animal to an event ***/

eventsRouter.post('/:eventId/animals', async (req:AuthenticatedRequest, res:Response) => {

});

/*** This route is used to remove an animal to an event ***/

eventsRouter.delete('/:eventId/animals', async (req:AuthenticatedRequest, res:Response) => {

});

export {eventsRouter}