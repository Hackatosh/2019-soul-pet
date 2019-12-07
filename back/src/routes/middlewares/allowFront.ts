import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {NextFunction, Response} from "express";

const allowFrontMW = async function (req:AuthenticatedRequest,res:Response,next:NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
};

export { allowFrontMW }