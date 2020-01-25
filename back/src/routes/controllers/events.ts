import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {inputValidationMW} from "../middlewares/inputValidation";
import {check} from 'express-validator'
import {PetEvent} from "../../database/models/event";
import {Animal} from "../../database/models/animal";
import {Specie} from "../../database/models/specie";
import {
    convertStringToDate,
    isDateTimeAfter,
    isDateValid,
    isNumericArray,
} from "../../core/utils";
import {User} from "../../database/models/user";
import {EventComment} from "../../database/models/eventComment";
import Sequelize from "sequelize";
import {EventPicture} from "../../database/models/eventPicture";

const eventsRouter = Router();

/***
 * This route is used to search for events using the various filters provided in the query string.
 ***/

const searchEvents = [
    check('keywords').notEmpty().isString().withMessage("keywords must be string").optional(),
    check('beginDate').notEmpty().custom(date => isDateValid(date)).withMessage("beginDate should be a valid datetime").optional(),
    check('endDate').notEmpty().custom(date => isDateValid(date)).withMessage("endDate should be a valid datetime").optional()
];

eventsRouter.get('/search', searchEvents, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const keywords = req.query.keywords;
    const beginDate = req.query.beginDate ? convertStringToDate(req.query.beginDate) : null;
    const endDate = req.query.endDate ? convertStringToDate(req.query.endDate) : null;
    let andConditions = [];

    if (keywords) {
        const listKeywords = keywords.split(" ");
        const conditionsKeywords: any = [];
        listKeywords.forEach(function (keyword: string) {
            conditionsKeywords.push({name: {[Sequelize.Op.like]: '%' + keyword + '%'}});
            conditionsKeywords.push({description: {[Sequelize.Op.like]: '%' + keyword + '%'}});
        });
        andConditions.push({[Sequelize.Op.or]: conditionsKeywords})
    }

    if (beginDate) {
        andConditions.push({beginDate: {[Sequelize.Op.gte]: beginDate}})
    }

    if (endDate) {
        andConditions.push({endDate: {[Sequelize.Op.lte]: endDate}})
    }

    let searchRequest = {[Sequelize.Op.and]: andConditions};

    let searchResult = await PetEvent.findAll({where: searchRequest, include:[{model:User,attributes:["username"]}]});
    res.status(200).json(searchResult);
});

/***
 * This route is used to get information about a specific event, identified by the provided eventId.
 * The information includes the list of the animals attending the event, the species authorized for the event and the comments made by the users concerning the event.
 ***/

const getEventChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
];

eventsRouter.get('/:eventId', getEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = parseInt(req.params.eventId);
    try {
        let eventFound = await PetEvent.findOne({
            where: {id: eventId},
            include: [{model: Animal, as: "attendees"}, {model: Specie, as: "authorizedSpecies"}, {
                model: EventComment,
                as: "eventComments"
            }, {
                model: EventPicture,
                as: "eventPictures",
            }]
        });
        if (!eventFound) {
            res.status(404).json({message: "Not found. The event you are trying to access does not exist."});
            return;
        }
        res.status(200).json(eventFound)
    } catch (e) {
        console.log(e)
    }
});

/***
 * This route is used to create a new event in the DB, using the provided informations.
 ***/

const postEventChecks = [
    check('name').notEmpty().isString().withMessage("name must be a valid string"),
    check('beginDate').notEmpty().custom(date => isDateValid(date)).withMessage("beginDate must be a valid datetime"),
    check('endDate').notEmpty().custom(date => isDateValid(date)).withMessage("endDate must be a valid datetime").custom((date, {req}) => isDateTimeAfter(date, req.body.beginDate)).withMessage("endDate must be after beginDate"),
    check('userId').notEmpty().isNumeric().withMessage("userId must be a valid number"),
    check('location').notEmpty().isString().withMessage("location should be a valid string").optional(),
    check('description').notEmpty().isString().withMessage("description must be a valid string"),
    check('specieIds').isArray().withMessage("specieIds must be an array of number"),
    check('specieIds').custom(array => isNumericArray(array)).withMessage("specieIds must be an array of number"),
];

eventsRouter.post('/', postEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const name = req.body.name;
    const beginDate = convertStringToDate(req.body.beginDate);
    const endDate = convertStringToDate(req.body.endDate);
    const userId = parseInt(req.body.userId);
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds.map((value: any) => parseInt(value));
    let userFound = await User.findOne({where: {id: userId}});
    if (userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    if (!userFound) {
        res.status(404).json({message: "userId doesn't match any user."})
    }
    for (let specieId of specieIds) {
        let specieFound = await Specie.findOne({where: {id: specieId}});
        if (!specieFound) {
            res.status(400).json({message: "You're trying to use an unexisting specie"});
            return;
        }
    }
    try {
        const event = await PetEvent.create({name, beginDate, endDate, userId, location, description});
        event.addAuthorizedSpecies(specieIds);
        await event.save();
        res.status(200).json(event)
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "Unable to create this event"})
    }
});

/***
 * This route is used to modify an event, identified by the provided eventId.
 ***/

const putEventChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a valid number"),
    check('name').notEmpty().isString().withMessage("name should be a valid string").optional(),
    check('beginDate').notEmpty().custom(date => isDateValid(date)).withMessage("beginDate should be a valid datetime").optional(),
    check('endDate').notEmpty().custom(date => isDateValid(date)).withMessage("endDate should be a valid datetime").custom((date, {req}) => isDateTimeAfter(date, req.body.beginDate)).withMessage("endDate must be after beginDate").optional(),
    check('location').notEmpty().isString().withMessage("location should be a valid string").optional(),
    check('description').notEmpty().isString().withMessage("description should be a valid string").optional(),
    check('specieIds').isArray().withMessage("specieIds should be an array of numbers").optional(),
    check('specieIds').custom(array => isNumericArray(array)).withMessage("specieIds should be an array of numbers").optional(),
];

eventsRouter.put('/:eventId', putEventChecks, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = parseInt(req.params.eventId);
    const authenticatedId = req.authInfos.userId;
    const name = req.body.name;
    const beginDate = convertStringToDate(req.body.beginDate);
    const endDate = convertStringToDate(req.body.endDate);
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds ? req.body.specieIds.map((value: any) => parseInt(value)) : undefined;
    let eventFound = await PetEvent.findOne({
        where: {id: eventId},
        include: [{model: Animal, as: "attendees"}, {model: Specie, as: "authorizedSpecies"}]
    });
    if (!eventFound) {
        res.status(404).json({message: "Not found. The event you are trying to access does not exist."});
        return;
    }
    if (eventFound.userId !== authenticatedId) {
        res.status(403).json({message: "Forbidden. You don't have access to this event."});
        return;
    }
    if (specieIds !== undefined) {
        for (let specieId of specieIds) {
            let specieFound = await Specie.findOne({where: {id: specieId}});
            if (!specieFound) {
                res.status(400).json({message: "You're trying to use an unexisting specie"});
                return;
            }
        }
    }
    let update: any = {};
    if (name) {
        update['name'] = name;
    }
    if (beginDate) {
        update['beginDate'] = beginDate;
    }
    if (endDate) {
        update['endDate'] = endDate;
    }
    if (location) {
        update['location'] = location;
    }
    if (description) {
        update['description'] = description;
    }
    try {
        await eventFound.set(update);
        if (specieIds !== undefined) {
            eventFound.setAuthorizedSpecies(specieIds);
            let attendees = eventFound.attendees ? eventFound.attendees.filter((value: Animal) => specieIds.indexOf(value.specieId) !== -1) : [];
            eventFound.setAttendees(attendees);
            update['specieIds'] = specieIds;
        }
        await eventFound.save();
        res.status(200).json(update);
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "Unable to update the event"});
    }
});

/***
 * This route is used to delete an event, identified by the provided eventId.
 ***/

const deleteEventChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
];

eventsRouter.delete('/:eventId', deleteEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = parseInt(req.params.eventId);
    const authenticatedId = req.authInfos.userId;
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if (!eventFound) {
        res.status(404).json({message: "Not found. The event you are trying to access does not exist."});
        return;
    }
    if (eventFound.userId !== authenticatedId) {
        res.status(403).json({message: "Forbidden. You don't have access to this event."});
        return;
    }
    await PetEvent.destroy({where: {id: eventId}});
    res.status(200).json({id: eventId});
});


/***
 * This route is used to add an animal, identified by the provided animalId, to the attendees of an event, identified by the provided eventId.
 ***/

const postAnimalInEventChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

eventsRouter.post('/:eventId/animals', postAnimalInEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedId = req.authInfos.userId;
    const eventId = parseInt(req.params.eventId);
    const animalId = parseInt(req.body.animalId);
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if (!eventFound) {
        res.status(404).json({message: "Not found. The event you are trying to access does not exist."});
        return;
    }
    let animalFound = await Animal.findOne({where: {id: animalId}});
    if (!animalFound) {
        res.status(404).json({message: "Not found. The animal you are trying to access does not exist."});
        return;
    }
    if (animalFound.userId !== authenticatedId) {
        res.status(403).json({message: "Forbidden. You don't have access to this animal."});
        return;
    }
    await eventFound.addAttendee(animalFound);
    res.status(200).json({eventId: eventId, animalId: animalId})
});

/***
 * This route is used to remove an animal, identified by the provided animalId, from the attendees of an event, identified by the provided eventId.
 ***/

const deleteAnimalFromEventChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

eventsRouter.delete('/:eventId/animals/:animalId', deleteAnimalFromEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedId = req.authInfos.userId;
    const eventId = parseInt(req.params.eventId);
    const animalId = parseInt(req.params.animalId);
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if (!eventFound) {
        res.status(404).json({message: "Not found. The event you are trying to access does not exist."});
        return;
    }
    let animalFound = await Animal.findOne({where: {id: animalId}});
    if (!animalFound) {
        res.status(404).json({message: "Not found. The animal you are trying to access does not exist."});
        return;
    }
    if (animalFound.userId !== authenticatedId) {
        res.status(403).json({message: "Forbidden. You don't have access to this animal."});
        return;
    }
    await eventFound.removeAttendee(animalFound);
    res.status(200).json({eventId: eventId, animalId: animalId})
});

export {eventsRouter}