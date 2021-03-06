import {Response, NextFunction} from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {getAuthInfosFromToken} from "../../core/authentication/tokens";

/***
 * Middleware used to require an authentication through an Authorization header with a JWT Token.
 * If the authentication fails, the middleware sends a 401 Unauthorized error.
 ***/

const loginRequiredMW = async function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT') {
        try {
            const token = req.headers.authorization.split(' ')[1];
            req.authInfos = await getAuthInfosFromToken(token);
            req.rawToken = token;
            next();
        } catch (e) {
            return res.status(401).json({errorMessage: "Unauthorized. Please login first."})
        }
    } else {
        return res.status(401).json({errorMessage: "Unauthorized. Please login first."})
    }

};

export {loginRequiredMW}