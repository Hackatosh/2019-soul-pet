import {Request, Response, Router} from "express";
import {inMemoryStorage} from "../../core/files/localStorage";
import {Folder, uploadToSFTP} from "../../core/files/ftp";
import {Animal} from "../../database/models/animal";
import {AnimalPictures} from "../../database/models/animalPictures";

const uploadRouter = Router();

uploadRouter.post('/animals',inMemoryStorage.single("photo"),async (req:Request, res:Response) => {
    try {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;
        const animalId = req.body.animalId;

        await uploadToSFTP(buffer, Folder.Pictures, filename);
        res.sendStatus(200);
        try {
            const animalPicture = await AnimalPictures.create({animalId, filename});
            res.status(200).send(animalPicture);
        } catch (e) {
            console.log(e);
            res.status(400).send({message: "Unable to save the picture"})
        }
    } catch(e){
        res.status(400).send({message:"Couldn't upload the file"})
    }

});