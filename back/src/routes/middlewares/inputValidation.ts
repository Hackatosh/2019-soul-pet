import {NextFunction, Response, Request} from "express";
import {validationResult} from 'express-validator';

/***
 * Middleware that can be used directly in routes that needs input validation.
 * It is used as follow :
 * app.post('/form',[check('email').isEmail(),check('age').isNumeric()], inputValidationMW, (req,res) => {...})
 * Basic tutorial provided here : https://flaviocopes.com/express-validate-input/
 ***/

const inputValidationMW = function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    } else {
        next();
    }
};

export {inputValidationMW}