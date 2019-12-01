import { Request, Response, Router } from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {revocateToken} from "../../core/authentication/tokens";

const logoutRouter = Router();

/*** Basic route to revocate your token and logout ***/

logoutRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
    await revocateToken(req.rawToken);
    res.sendStatus(200);
});

export { logoutRouter };