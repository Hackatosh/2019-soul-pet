import { Request, Response, NextFunction} from 'express';
import {env} from '../../config/env'
import {verify} from 'jsonwebtoken'
import {AuthenticatedRequest, AuthenticationInfos} from "../../core/authentication/authenticationInterfaces";

const loginRequiredMW = async function (req:AuthenticatedRequest,res:Response,next:NextFunction) {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT'){
        try {
            const decode:any = await verify(req.headers.authorization.split(' ')[1],env.SECRET_KEY);
            req.user = new AuthenticationInfos(decode.id,decode.username,decode.email);
            next();
        } catch(e){
            return res.status(401).json({errorMessage : "Unauthorized. Please login first."})
        }
    } else {
        return res.status(401).json({errorMessage : "Unauthorized. Please login first."})
    }

};

export {loginRequiredMW}