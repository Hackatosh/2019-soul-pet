import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

const handleError500 = function (err:ErrorRequestHandler, req:Request, res:Response, next: NextFunction) {
  console.log("Error 500 !");
  res.status(500).send({ endpoint: req.baseUrl, uri: req.baseUrl + req.path, method: req.method });
};

export {handleError500}