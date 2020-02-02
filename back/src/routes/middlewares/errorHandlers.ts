import {Request, Response, NextFunction} from 'express';
import {logger} from "../../core/logger";

/***
 * Middleware to handle internal server errors.
 ***/

const handleError500MW = function (err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error("Error 500 !");
    logger.error(err);
    res.status(500).json({endpoint: req.baseUrl, uri: req.baseUrl + req.path, method: req.method});
};

export {handleError500MW}