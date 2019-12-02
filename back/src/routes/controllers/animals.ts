import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";

const animalsRouter = Router();

/*** POST route use to create an animal profile linked to a userId ***/

animalsRouter.post('/',async (req:AuthenticatedRequest,res:Response) => {

});