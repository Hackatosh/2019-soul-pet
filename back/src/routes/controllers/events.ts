import { Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {inputValidationMW} from "../middlewares/inputValidation";
import { check } from 'express-validator'
import {PetEvent} from "../../database/models/event";
import {Animal} from "../../database/models/animal";
import {Specie} from "../../database/models/specie";
import {isDateValid, isNumericArray} from "../../core/utils";
import {User} from "../../database/models/user";


const eventsRouter = Router();

/*** This route is used to get informations about an event ***/

const getEventChecks = [
    check('eventId').notEmpty().isNumeric(),
]

eventsRouter.get('/:eventId', getEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const eventId = parseInt(req.params.eventId);
    try {
        let eventFound = await PetEvent.findOne({where: {id: eventId}, include: [{model: Animal, as: "Attendees"},{ model: Specie, as: "AuthorizedSpecies", include:[]}]});
        if (!eventFound) {
            res.status(404).json({errorMessage: "Not found. The event you are trying to access does not exist."});
            return;
        }
        res.status(200).send({event: eventFound})
    } catch(e){
        console.log(e)
    }
});

/*** This route is used to create a new event ***/

const postEventChecks = [
    check('name').notEmpty().isString(),
    check('beginDate').notEmpty().custom( date => isDateValid(date)),
    check('endDate').notEmpty().custom( date => isDateValid(date)),
    check('userId').notEmpty().isNumeric(),
    check('location').notEmpty().isString().optional(),
    check('description').notEmpty().isString(),
    check('specieIds').isArray(),
    check('specieIds').custom(array => isNumericArray(array)),
];

eventsRouter.post('/', postEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const name = req.body.name;
    const beginDate = req.body.beginDate;
    const endDate = req.body.endDate;
    const userId = parseInt(req.body.userId);
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds.map((value:any) => parseInt(value));
    let userFound = await User.findOne({where:{id:userId}});
    if(userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."});
        return;
    }
    if(!userFound){
        res.status(404).send({error:"userId doesn't match any user."})
    }
    for(let specieId of specieIds){
        let specieFound = await Specie.findOne({where:{id:specieId}});
        if(!specieFound){
            res.status(400).send({error:"You're trying to use an unexisting specie"});
            return;
        }
    }
    try {
        const event = await PetEvent.create({name, beginDate, endDate, userId, location, description});
        event.addAuthorizedSpecies(specieIds);
        await event.save();
        res.status(200).send({event: event})
    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Unable to create this event"})
    }
});

/*** This route is used to modify an event ***/
const putEventChecks = [
    check('eventId').notEmpty().isNumeric().optional(),
    check('name').notEmpty().isString().optional(),
    check('beginDate').notEmpty().custom( date => isDateValid(date)).optional(),
    check('endDate').notEmpty().custom( date => isDateValid(date)).optional(),
    check('location').notEmpty().isString().optional(),
    check('description').notEmpty().isString().optional(),
    check('specieIds').isArray().optional(),
    check('specieIds').custom(array => isNumericArray(array)).optional(),
];

eventsRouter.put('/:eventId', putEventChecks, async (req:AuthenticatedRequest, res:Response) => {
    const eventId = parseInt(req.params.eventId);
    const authenticatedId = req.authInfos.userId;
    const name = req.body.name;
    const beginDate = req.body.begindDate;
    const endDate = req.body.endDate;
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds ? req.body.specieIds.map((value:any) => parseInt(value)) : undefined;
    let eventFound = await PetEvent.findOne({where: {id: eventId}, include:[{model:Animal,as:"Attendees"},{ model: Specie, as: "AuthorizedSpecies"}]});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    if(eventFound.userId !== authenticatedId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this event."});
        return;
    }
    if(specieIds !== undefined) {
        for (let specieId of specieIds) {
            let specieFound = await Specie.findOne({where: {id: specieId}});
            if (!specieFound) {
                res.status(400).send({error: "You're trying to use an unexisting specie"});
                return;
            }
        }
    }
    let update:any = {};
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
        if(specieIds !== undefined) {
            eventFound.setAuthorizedSpecies(specieIds);
            let attendees = eventFound.attendees ? eventFound.attendees.filter((value: Animal) => specieIds.indexOf(value.specieId) !== -1) : [];
            eventFound.setAttendees(attendees);
            update['specieIds'] = specieIds;
        }
        await eventFound.save();
        res.status(200).json({update: update});
    } catch (e) {
        console.log(e);
        res.status(400).json({errorMessage: "Unable to update the event"});
    }
});

/*** This route is used to delete an event ***/

const deleteEventChecks = [
    check('eventId').notEmpty().isNumeric(),
];

eventsRouter.delete('/:eventId',deleteEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const eventId = parseInt(req.params.eventId);
    const authenticatedId = req.authInfos.userId;
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    if(eventFound.userId !== authenticatedId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this event."});
        return;
    }
    await PetEvent.destroy({where:{id:eventId}});
    res.status(200).send({eventId:eventId});
});



/*** This route is used to add an animal to an event ***/

const postAnimalInEventChecks = [
    check('eventId').notEmpty().isNumeric(),
    check('animalId').notEmpty().isNumeric(),
];

eventsRouter.post('/:eventId/animals', postAnimalInEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const authenticatedId = req.authInfos.userId;
    const eventId = parseInt(req.params.eventId);
    const animalId = parseInt(req.body.animalId);
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    let animalFound = await Animal.findOne({where: {id: animalId}});
    if(!animalFound){
        res.status(404).json({errorMessage:"Not found. The animal you are trying to access does not exist."});
        return;
    }
    if(animalFound.userId !== authenticatedId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this animal."});
        return;
    }
    await eventFound.addAttendee(animalFound);
    res.status(200).send({eventId: eventId, animalId: animalId})
});

/*** This route is used to remove an animal to an event ***/
const deleteAnimalFromEventChecks = [
    check('eventId').notEmpty().isNumeric(),
    check('animalId').notEmpty().isNumeric(),
];

eventsRouter.delete('/:eventId/animals/:animalId', deleteAnimalFromEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const authenticatedId = req.authInfos.userId;
    const eventId = parseInt(req.params.eventId);
    const animalId = parseInt(req.params.animalId);
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    let animalFound = await Animal.findOne({where: {id: animalId}});
    if(!animalFound){
        res.status(404).json({errorMessage:"Not found. The animal you are trying to access does not exist."});
        return;
    }
    if(animalFound.userId !== authenticatedId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this animal."});
        return;
    }
    await eventFound.removeAttendee(animalFound);
    res.status(200).send({eventId: eventId, animalId: animalId})
});

export {eventsRouter}