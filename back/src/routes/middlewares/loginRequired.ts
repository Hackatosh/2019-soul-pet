import { Response, NextFunction} from 'express';
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {getAuthInfosFromToken} from "../../core/authentication/tokens";

/*** Middleware to require an authentication through an Authorization header with a JWT Token ***/

const loginRequiredMW = async function (req:AuthenticatedRequest,res:Response,next:NextFunction) {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT'){
        try {
            const token = req.headers.authorization.split(' ')[1];
            req.user = await getAuthInfosFromToken(token);
            req.token = token;
            next();
        } catch(e){
            return res.status(401).json({errorMessage : "Unauthorized. Please login first."})
        }
    } else {
        return res.status(401).json({errorMessage : "Unauthorized. Please login first."})
    }

};

export {loginRequiredMW}