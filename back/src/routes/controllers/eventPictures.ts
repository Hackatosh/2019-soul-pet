import {Response, Router} from "express";
import {ContentType, deleteFromSFTP, Folder, pipeSFTPIntoResponse, uploadToSFTP} from "../../core/files/ftp";
import {Animal} from "../../database/models/animal";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {createPictureStorage, resolvePictureContentType} from "../../core/files/pictureStorage";
import {PetEvent} from "../../database/models/event";
import {EventPicture} from "../../database/models/eventPicture";

const eventPicturesRouter = Router();

/***
 * This route allows to list all the pictures for a given event.
 ***/

const getEventPicturesChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
];

eventPicturesRouter.get('/:eventId', getEventPicturesChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = req.params.eventId;
    const event = await PetEvent.findOne({where: {id: eventId}});
    if (!event) {
        res.status(404).json({message: "This event does not exist"});
        return;
    }
    const pictures = await EventPicture.findAll({where: {eventId: eventId}});
    res.status(200).json(pictures);
});

/***
 * This route allows to download a picture, identified by the provided filename, from the EventPictures folder.
 ***/

const getEventPictureChecks = [
    check('filename').notEmpty().isString().withMessage("filename must be a string"),
];

eventPicturesRouter.get('/', getEventPictureChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const filename = req.query.filename;
    const file = await EventPicture.findOne({where: {filename: filename}});
    if (!file) {
        res.status(404).json({message: "This file does not exist."});
        return;
    }
    const event = await PetEvent.findOne({where: {id: file.eventId}});
    if (!event) {
        res.status(404).json({message: "This event does not exist"});
        return;
    }

    try {
        await pipeSFTPIntoResponse(res, Folder.EventPictures, filename, file.contentType)
    } catch (e) {
        res.status(400).json({message: "Problem when downloading the file"})
    }
});

/***
 * This route allows to upload a picture for a given animal into the EventPictures folder.
 * The event picture is associated to the event profile identified by the provided eventId.
 ***/

const postEventPicturesChecks = [
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
];

eventPicturesRouter.post('/:eventId', createPictureStorage("picture"), postEventPicturesChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buffer = req.file.buffer;
        const contentType = resolvePictureContentType(req.file);
        const userId = req.authInfos.userId;
        const eventId = req.params.eventId;
        const event = await PetEvent.findOne({where: {id: eventId}});
        if (!event) {
            res.status(404).json({message: "This event does not exist"})
        } else {
            try {
                const filename = await uploadToSFTP(buffer, Folder.EventPictures);
                const eventPicture = await EventPicture.create({eventId,userId, filename, contentType});
                res.status(200).json(eventPicture);
            } catch (e) {
                console.log(e);
                res.status(400).json({message: "Unable to save the picture"})
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "Couldn't upload the file"})
    }

});

/***
 * This route allows to delete a picture, identified by the provided filename, from the EventPictures folder.
 ***/

const deleteEventPictureChecks = [
    check('filename').notEmpty().isString().withMessage("filename must be a string"),
];

eventPicturesRouter.delete('/', deleteEventPictureChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const filename = req.query.filename;
    const userId = req.authInfos.userId;
    const eventId = req.params.eventId;
    const file = await EventPicture.findOne({where: {filename: filename}});
    if (!file) {
        res.status(404).json({message: "This file does not exist."});
        return;
    }
    const picture = await EventPicture.findOne({where: {id: file.eventId}});
    const event = await PetEvent.findOne({where:{id: file.eventId}});

    if (!picture) {
        res.status(404).json({message: "This event does not exist"});
        return;
    }


    else if (picture.userId !== userId && event.userId !== userId ) {
        res.status(403).json({message: "You don't have access to this picture "});
        return;
    }
    else {
        await file.destroy();
        try {
            await deleteFromSFTP(Folder.EventPictures, filename);
            res.status(200).json(file);
        } catch (e) {
            res.status(400).json({message: "Problem when deleting the file : file record has been deleted from the DB but the file still exists."})
        }
    }
});

export {eventPicturesRouter}