import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {Animal} from "../../database/models/animal";
import { check } from 'express-validator'
import {inputValidationMW} from "../middlewares/inputValidation";
import {Specie} from "../../database/models/specie";

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
    const userId = req.query.userId;
    if(userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."})
    }
    const animals = await Animal.findAll({where: {userId:userId}});
    res.status(200).send({animals:animals})
});

/*** This route is used to create a new animal profile for a given user***/

animalsRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {

});

/*** This route is used to edit an animal profile***/

animalsRouter.put('/:animalId', async (req: AuthenticatedRequest, res: Response) => {

});

/*** This route is used to delete an animal profile***/

const deleteAnimalChecks = [
    check('animalId').notEmpty().isNumeric(),
    check('userId').notEmpty().isNumeric(),
];

animalsRouter.delete('/:animalId',deleteAnimalChecks,inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.query.userId;
    const animalId = req.params.animalId;
    if(userId !== req.authInfos.userId){
        res.status(403).json({errorMessage:"Forbidden. You don't have access to this user."})
    }
    const animal = await Animal.findOne({where: {id:animalId}});
    if(!animal){
        res.status(404).json({errorMessage:"Not found. The animal you are trying to access does not exist."})
    }
    if(userId !== animal.userId){
        res.status(403).json({errorMessage:"Forbidden. The animal does not belong to the request user."})
    }
    await Animal.destroy({where: {id:animalId}});
    res.status(200).send({id:animalId})
});

export {animalsRouter}