import {Response, Router} from "express";
import {inMemoryStoragePicture, resolvePictureContentType} from "../../core/files/localStorage";
import {ContentType, deleteFromSFTP, Folder, pipeSFTPIntoResponse, uploadToSFTP} from "../../core/files/ftp";
import {Animal} from "../../database/models/animal";
import {AnimalPicture} from "../../database/models/animalPicture";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";

const animalPicturesRouter = Router();

/***
 * This route allows to list all the pictures for a given animal.
 ***/

const getAnimalPicturesChecks = [
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

animalPicturesRouter.get('/:animalId', getAnimalPicturesChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const animalId = req.params.animalId;
    const userId = req.authInfos.userId;
    const pet = await Animal.findOne({where: {id: animalId}});
    if (!pet) {
        res.status(404).json({message: "This animal does not exist"});
        return;
    }
    if (pet.userId !== userId) {
        res.status(403).json({message: "You don't have access to this animal"});
        return;
    }
    const pictures = await AnimalPicture.findAll({where:{animalId:animalId}});
    res.status(200).json(pictures);
});

/***
 * This route allows to download a pictures.
 ***/

const getAnimalPictureChecks = [
    check('filename').notEmpty().isString().withMessage("filename must be a string"),
];

animalPicturesRouter.get('/', getAnimalPictureChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const filename = req.query.filename;
    const userId = req.authInfos.userId;
    const file = await AnimalPicture.findOne({where:{filename:filename}});
    if(!file){
        res.status(404).json({message: "This file does not exist."})
    }
    const pet = await Animal.findOne({where: {id: file.animalId}});
    if (!pet) {
        res.status(404).json({message: "This animal does not exist"});
        return;
    }
    if (pet.userId !== userId) {
        res.status(403).json({message: "You don't have access to this animal"});
        return;
    }
    try {
        await pipeSFTPIntoResponse(res,Folder.AnimalPictures, filename, file.contentType)
    } catch(e){
        res.status(400).json({message:"Problem when downloading the file"})
    }
});

/***
 * This route allows to upload a picture for a given animal.
 ***/

const postAnimalPicturesChecks = [
    check('animalId').notEmpty().isNumeric().withMessage("animalId must be a number"),
];

animalPicturesRouter.post('/:animalId', inMemoryStoragePicture.single("picture"), postAnimalPicturesChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;
        const contentType = resolvePictureContentType(req.file);
        const animalId = req.params.animalId;
        const userId = req.authInfos.userId;
        const pet = await Animal.findOne({where: {id: animalId}});
        if (!pet) {
            res.status(404).json({message: "This animal does not exist"})
        } else if (pet.userId !== userId) {
            res.status(403).json({message: "You don't have access to this animal"})
        } else {
            try {
                await uploadToSFTP(buffer, Folder.AnimalPictures, filename);
                const animalPicture = await AnimalPicture.create({animalId, filename, contentType});
                res.status(200).send(animalPicture);
            } catch (e) {
                console.log(e);
                res.status(400).send({message: "Unable to save the picture"})
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({message: "Couldn't upload the file"})
    }

});

/***
 * This route allows to download a pictures.
 ***/

const deleteAnimalPictureChecks = [
    check('filename').notEmpty().isString().withMessage("filename must be a string"),
];

animalPicturesRouter.delete('/', deleteAnimalPictureChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const filename = req.query.filename;
    const userId = req.authInfos.userId;
    const file = await AnimalPicture.findOne({where:{filename:filename}});
    if(!file){
        res.status(404).json({message: "This file does not exist."})
    }
    const pet = await Animal.findOne({where: {id: file.animalId}});
    if (!pet) {
        res.status(404).json({message: "This animal does not exist"});
        return;
    }
    if (pet.userId !== userId) {
        res.status(403).json({message: "You don't have access to this animal"});
        return;
    }
    await file.destroy();
    try {
        await deleteFromSFTP(Folder.AnimalPictures, filename);
        res.status(200).json(file);
    } catch(e){
        res.status(400).json({message:"Problem when deleting the file : file record has been deleted from the DB but the file still exists."})
    }
});

export {animalPicturesRouter}