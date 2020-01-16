import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {Animal} from "../../database/models/animal";
import {check} from 'express-validator'
import {inputValidationMW} from "../middlewares/inputValidation";
import {Specie} from "../../database/models/specie";
import {isDateValid} from "../../core/utils";
import {convertStringToDate} from "../../core/utils";
import {PetEvent} from "../../database/models/event";

const animalsRouter = Router();

/*** This route is used to obtained the list of all species ***/

animalsRouter.get('/species', async (req: AuthenticatedRequest, res: Response) => {
    const species = await Specie.findAll();
    res.status(200).send(species);
});

/*** This route is used to obtained the list of all the animal profiles of a given user***/

const getUserAnimalsChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
];

animalsRouter.get('/', getUserAnimalsChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.query.userId);
    if (userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    const animals = await Animal.findAll({where: {userId: userId},include: [{model: Specie}]});
    res.status(200).send(animals)
});

/*** This route is used to obtained an animal profile. ***/

const getUserAnimalChecks = [
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

animalsRouter.get('/:animalId', getUserAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = parseInt(req.params.animalId);
    const animal = await Animal.findOne({where: {id: animalId},include: [{model: PetEvent, as: "Events"},{model: Specie}]});
    if (!animal) {
        res.sendStatus(404);
    } else if (animal.userId != req.authInfos.userId) {
        res.sendStatus(403);
    } else {
        res.status(200).send(animal);
    }
});

/*** This route is used to create a new animal profile ***/

const postAnimalChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
    check('specieId').notEmpty().isNumeric().withMessage("specieId must be a number"),
    check('name').notEmpty().isString().withMessage("name must be a valid string"),
    check('birthdate').notEmpty().custom(date => isDateValid(date)).withMessage("birthdate must be a correct date"),
];

animalsRouter.post('/', postAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.body.userId);
    const specieId = parseInt(req.body.specieId);
    const name = req.body.name;
    const birthdate = convertStringToDate(req.body.birthdate);
    if (userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    if (!await Specie.findOne({where: {id: specieId}})) {
        res.status(400).json({message: "Bad request. The specie you indicated is not registered in DB."});
        return;
    }
    try {
        const animal = await Animal.create({userId, specieId, name, birthdate});
        res.status(200).send(animal)
    } catch (e) {
        console.log(e);
        res.status(400).send({message: "Unable to register the animal"})
    }
});

/*** This route is used to edit an animal profile***/

const putAnimalChecks = [
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
    check('specieId').notEmpty().isNumeric().withMessage("specieId should be a number").optional(),
    check('name').notEmpty().isString().withMessage("name should be a valid string").optional(),
    check('birthdate').notEmpty().custom(date => isDateValid(date)).withMessage("birthdate should be a correct date").optional(),
];

animalsRouter.put('/:animalId', putAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = parseInt(req.params.animalId);
    const specieId = parseInt(req.body.specieId);
    const name = req.body.name;
    const birthdate = req.body.birthdate ? convertStringToDate(req.body.birthdate) : null;
    const animalFound = await Animal.findOne({where: {id: animalId}});
    if (!animalFound) {
        res.status(404).json({message: "Not found. The animal you are trying to access does not exist."});
        return;
    }
    if (animalFound.userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this animal."});
        return;
    }
    if (specieId && !(await Specie.findOne({where: {id: specieId}}))) {
        res.status(400).json({message: "Bad request. The specie you indicated is not registered in DB."});
        return;
    }
    let update: any = {};
    if (name) {
        update = {name: name, ...update}
    }
    if (birthdate) {
        update = {birthdate: birthdate, ...update}
    }
    if (specieId) {
        update = {specieId: specieId, ...update}
    }
    await Animal.update(update, {where: {id: animalId}});
    res.status(200).send(update);
});

/*** This route is used to delete an animal profile***/

const deleteAnimalChecks = [
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

animalsRouter.delete('/:animalId', deleteAnimalChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = parseInt(req.params.animalId);

    const animal = await Animal.findOne({where: {id: animalId}});
    if (!animal) {
        res.status(404).json({message: "Not found. The animal you are trying to access does not exist."});
        return;
    }
    if (req.authInfos.userId !== animal.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    await Animal.destroy({where: {id: animalId}});
    res.status(200).json({id: animalId})
});

export {animalsRouter}
