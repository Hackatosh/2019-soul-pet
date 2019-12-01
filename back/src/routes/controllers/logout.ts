import { Request, Response, Router } from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {revocateToken} from "../../core/authentication/tokens";

const logoutRouter = Router();

/*** Basic route to revocate your token and logout ***/

logoutRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
    await revocateToken(req.token);
    res.sendStatus(200);
});

export { logoutRouter };