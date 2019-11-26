import { Request, Response, Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { healthRouter };
