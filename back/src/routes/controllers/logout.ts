import {Request, Response, Router} from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {revocateToken} from "../../core/authentication/tokens";

const logoutRouter = Router();

/***
 * This route allows to revoke the JWT token contained in the authentications infos in the request.
 * This operation basically logs out the previously authenticated user.
 ***/

logoutRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
    await revocateToken(req.rawToken);
    res.sendStatus(200);
});

export {logoutRouter};