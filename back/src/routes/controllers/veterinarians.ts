import {Response, Router} from "express";
import {searchVeterinarian} from "../../core/placesAPI/getVeterinarian";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";

const veterinariansRouter = Router();

/** This route is used to search for veterinarians near the user **/

const getSearchVeterinariansCheck = [
    check('lat').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('long').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('radius').notEmpty().isNumeric().withMessage("lat must be a number")
]

veterinariansRouter.get('/search', getSearchVeterinariansCheck, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const searchPromise = searchVeterinarian(parseFloat(req.query.lat), parseFloat(req.query.long), parseInt(req.query.radius));
    await searchPromise.then((result: any) => {
        res.send(result)
    })
});

export {veterinariansRouter};