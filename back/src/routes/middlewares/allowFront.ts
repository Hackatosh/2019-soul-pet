import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {NextFunction, Response} from "express";

const allowFrontMW = async function (req:AuthenticatedRequest,res:Response,next:NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
};

export { allowFrontMW }