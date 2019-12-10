import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {Animal} from "../../database/models/animal";
import { check } from 'express-validator'
import {inputValidationMW} from "../middlewares/inputValidation";
import {Specie} from "../../database/models/specie";
import {isDateValid} from "../../core/utils";

const animalsRouter = Router();

/*** This route is used to obtained the list of all species ***/

animalsRouter.get('/species', async (req: AuthenticatedRequest, res: Response) => {
    const species = await Specie.findAll();
    res.status(200).send({species:species});
});

/*** This route is used to obtained the list of all the animal profiles of a given user***/

const getUserAnimalsChecks = [
    check('userId').notEmpty().isNumeric(),
];

animalsRouter.get('/', getUserAnimalsChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.query.userId);
    if(userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."});
        return;
    }
    const animals = await Animal.findAll({where: {userId:userId}});
    res.status(200).send({animals:animals})
});

/*** This route is used to create a new animal profile ***/

const postAnimalChecks = [
    check('userId').notEmpty().isNumeric(),
    check('specieId').notEmpty().isNumeric(),
    check('name').notEmpty().isString(),
    check('birthdate').notEmpty().custom( date => isDateValid(date)),
];

animalsRouter.post('/', postAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.body.userId);
    const specieId = parseInt(req.body.specieId);
    const name = req.body.name;
    const birthdate = req.body.birthdate;
    if(userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."});
        return;
    }
    if(!await Specie.findOne({where:{id:specieId}})){
        res.status(400).json({errorMessage:"Bad request. The specie you indicated is not registered in DB."});
        return;
    }
    try {
        const animal = await Animal.create({userId, specieId, name, birthdate});
        res.status(200).send(animal)
    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Unable to register the animal"})
    }
});

/*** This route is used to edit an animal profile***/

const putAnimalChecks = [
    check('animalId').notEmpty().isNumeric(),
    check('specieId').notEmpty().isNumeric().optional(),
    check('name').notEmpty().isString().optional(),
    check('birthdate').notEmpty().custom( date => isDateValid(date)).optional(),
];

animalsRouter.put('/:animalId', putAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = parseInt(req.params.animalId);
    const specieId = parseInt(req.body.specieId);
    const name = req.body.name;
    const birthdate = req.body.birthdate;
    const animalFound = await Animal.findOne({where: {id:animalId}});
    if(!animalFound){
        res.status(404).json({errorMessage:"Not found. The animal you are trying to access does not exist."});
        return;
    }
    if(animalFound.userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this animal."});
        return;
    }
    if(!await Specie.findOne({where:{id:specieId}})){
        res.status(400).json({errorMessage:"Bad request. The specie you indicated is not registered in DB."});
        return;
    }
    let update:any = {};
    if(name){
        update = {name:name, ...update}
    }
    if(birthdate) {
        update = {birthdate:birthdate, ...update}
    }
    if(specieId) {
        update = {specieId:specieId, ...update}
    }
    await Animal.update(update,{where:{id:animalId}});
    res.status(200).send({update:update})
});

/*** This route is used to delete an animal profile***/

const deleteAnimalChecks = [
    check('animalId').notEmpty().isNumeric(),
];

animalsRouter.delete('/:animalId',deleteAnimalChecks,inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = parseInt(req.params.animalId);

    const animal = await Animal.findOne({where: {id:animalId}});
    if(!animal){
        res.status(404).json({errorMessage:"Not found. The animal you are trying to access does not exist."});
        return;
    }
    if(req.authInfos.userId !== animal.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."});
        return;
    }
    await Animal.destroy({where: {id:animalId}});
    res.status(200).send({id:animalId})
});

export {animalsRouter}
