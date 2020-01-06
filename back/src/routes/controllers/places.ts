import {Request, Response, Router} from "express";
import {searchPlaces} from "../../core/placesAPI/getPlaces";
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
    const lat = parseFloat(req.query.lat);
    const long = parseFloat(req.query.long);
    const radius = parseInt(req.query.radius);
    const placeType = req.query.placeType;

    if (isNaN(lat)  || isNaN(long) || isNaN(radius)){
        res.status(500).json({message: "Incorrect fields for Places API"});
    }
    else {
        try {
            const results = await searchPlaces(lat, long, radius, placeType);
            res.send(results)
        } catch (e) {
            console.log(e)
            res.status(501).json({message: "Unable to get Places API results"});
        }
    }

});

export {placesRouter};