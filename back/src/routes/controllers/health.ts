import {Request, Response, Router} from 'express';

const healthRouter = Router();

/***
 * Basic route to ping the server and know if it's alive.
 ***/

healthRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "WELCOME"});
});

export {healthRouter};
