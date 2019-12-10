import { Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {inputValidationMW} from "../middlewares/inputValidation";
import { check } from 'express-validator'
import {PetEvent} from "../../database/models/event";
import {Animal} from "../../database/models/animal";
import {Specie} from "../../database/models/specie";
import moment from "moment";

const eventsRouter = Router();

/*** This route is used to get informations about an event ***/

eventsRouter.get('/:eventId', async (req:AuthenticatedRequest, res:Response) => {
    const eventId = parseInt(req.params.eventId);
    let eventFound = await PetEvent.findOne({where: {id: eventId}, include:[Animal, Specie]});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    res.status(200).send({event:eventFound})
});

/*** This route is used to create a new event ***/

const postEventChecks = [
    check('name').notEmpty().isString(),
    check('beginDate').notEmpty().custom( date => {return moment(date, 'MM/DD/YYYY',true).isValid()}),
    check('endDate').notEmpty().custom( date => {return moment(date, 'MM/DD/YYYY',true).isValid()}),
    check('userId').notEmpty().isNumeric().optional(),
    check('location').notEmpty().isString(),
    check('description').notEmpty().isString(),
    check('specieIds').isArray(),
    check('specieIds[*]').isNumeric(),
];

eventsRouter.post('/', postEventChecks, inputValidationMW, async (req:AuthenticatedRequest, res:Response) => {
    const name = req.body.name;
    const beginDate = req.body.begindDate;
    const endDate = req.body.endDate;
    const userId = parseInt(req.body.userId); // Can be null
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds.map((value:any) => parseInt(value));
    if(userId && userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."});
        return;
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
    check('beginDate').notEmpty().custom( date => {return moment(date, 'MM/DD/YYYY',true).isValid()}).optional(),
    check('endDate').notEmpty().custom( date => {return moment(date, 'MM/DD/YYYY',true).isValid()}).optional(),
    check('location').notEmpty().isString().optional(),
    check('description').notEmpty().isString().optional(),
    check('specieIds').isArray().optional(),
    check('specieIds[*]').isNumeric().optional(),
];

eventsRouter.put('/:eventId', putEventChecks, async (req:AuthenticatedRequest, res:Response) => {
    const eventId = parseInt(req.params.eventId);
    const authenticatedId = req.authInfos.userId;
    const name = req.body.name;
    const beginDate = req.body.begindDate;
    const endDate = req.body.endDate;
    const location = req.body.location;
    const description = req.body.description;
    const specieIds: Array<number> = req.body.specieIds.map((value:any) => parseInt(value));
    let eventFound = await PetEvent.findOne({where: {id: eventId}});
    if(!eventFound){
        res.status(404).json({errorMessage:"Not found. The event you are trying to access does not exist."});
        return;
    }
    if(eventFound.userId !== authenticatedId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this event."});
        return;
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