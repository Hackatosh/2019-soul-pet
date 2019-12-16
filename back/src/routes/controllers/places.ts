import {Request, Response, Router} from "express";
import {searchPlaces} from "../../core/placesAPI/getPlaces";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";

const placesRouter = Router();

/** This route is used to search for veterinarians near the user **/

const getSearchPlacesCheck = [
    check('lat').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('long').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('radius').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('placeType').notEmpty().isString().withMessage("placeType must be string")
];

placesRouter.get('/search', getSearchPlacesCheck, inputValidationMW, async (req: Request, res: Response) => {
    const searchPromise = searchPlaces(parseFloat(req.query.lat), parseFloat(req.query.long), parseInt(req.query.radius),
        req.query.placeType);
    await searchPromise.then((result: any) => {
        res.send(result)
    })
});

export {placesRouter};