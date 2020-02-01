import {Request, Response, Router} from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {revokeToken} from "../../core/authentication/tokens";

const logoutRouter = Router();

/***
 * This route allows to revoke the JWT token contained in the authentications infos in the request.
 * This operation basically logs out the previously authenticated user.
 ***/

logoutRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
    await revokeToken(req.rawToken);
    res.status(200).json({message: "The token has been correctly deleted.", rawToken: req.rawToken});
});

export {logoutRouter};