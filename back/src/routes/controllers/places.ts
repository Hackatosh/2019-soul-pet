import {Response, Router} from "express";
import {searchPlaces} from "../../core/placesAPI/getPlaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {logger} from "../../core/logger";

const placesRouter = Router();

/***
 * This route allows to obtains the list of the provided place type near the provided position (lat, long) in the provided radius.
 ***/

const getSearchPlacesCheck = [
    check('lat').notEmpty().isNumeric().withMessage("lat must be a number"),
    check('long').notEmpty().isNumeric().withMessage("long must be a number"),
    check('radius').notEmpty().isNumeric().withMessage("radius must be a number"),
    check('placeType').notEmpty().isString().isLength({max: 128}).withMessage("placeType must be string shorter than 128 characters"),

    check('lat').custom(lat => Math.abs(lat) < 180).withMessage("lat must be between -180 and 180"),
    check('long').custom(long => Math.abs(long) < 360).withMessage("long must be between -360 and 360"),
    check('placeType').custom(placeType => ['vet', 'park', 'groom'].includes(placeType)).withMessage('placeType must be vet, groom or park')
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
        logger.error(e);
        res.status(503).json({message: "Unable to get Places API results."});
    }
});

export {placesRouter};