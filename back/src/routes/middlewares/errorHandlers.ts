import { Request, Response, NextFunction } from 'express';

/***
 * Middleware to handle internal server errors.
 ***/

const handleError500MW = function (err:Error, req:Request, res:Response, next: NextFunction) {
  console.log("Error 500 !");
  console.log(err);
  res.status(500).send({ endpoint: req.baseUrl, uri: req.baseUrl + req.path, method: req.method });
};

export {handleError500MW}