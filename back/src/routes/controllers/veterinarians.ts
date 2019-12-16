import Router from "express";
import {searchVeterinarian} from "../../core/placesAPI/getVeterinarian";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";

const veterinariansRouter = Router();

/** This route is used to search for veterinarians near the user **/

veterinariansRouter.get('/search', (req : any, res: any) => {
    const searchPromise = searchVeterinarian(req.query.lat, req.query.long, req.query.radius);
    searchPromise.then((result : any) => {res.send(result)});
})
