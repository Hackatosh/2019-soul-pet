import {Request, Response, Router} from "express";
import {searchPlaces} from "../../core/placesAPI/getPlaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";

const placesRouter = Router();

/** This route is used to search for veterinarians near the user **/

const getSearchPlacesCheck = [
    check('lat').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('long').notEmpty().isNumeric().withMessage("long must be a number"),
    check('radius').notEmpty().isNumeric().withMessage("radius must be a number"),
    check('placeType').notEmpty().isString().withMessage("placeType must be string")
];

placesRouter.get('/search', getSearchPlacesCheck, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const lat = parseFloat(req.query.lat);
    const long = parseFloat(req.query.long);
    const radius = parseInt(req.query.radius);
    const placeType = req.query.placeType;
    try {
        const results = await searchPlaces(lat, long, radius, placeType);
        res.send(results);
    } catch (e) {
        console.log(e);
        res.status(503).json({message: "Unable to get Places API results"});
    }
});

export {placesRouter};