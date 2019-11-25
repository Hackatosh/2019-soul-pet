import { Request, Response, Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.send(200);
});

export { healthRouter };
