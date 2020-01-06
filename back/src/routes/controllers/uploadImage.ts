import {Request, Response, Router} from "express";
import {inMemoryStorage} from "../../core/files/localStorage";
import {Folder, uploadToSFTP} from "../../core/files/ftp";
import {Animal} from "../../database/models/animal";
import {AnimalPictures} from "../../database/models/animalPictures";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";

const uploadRouter = Router();

uploadRouter.post('/animals/:animalId',inMemoryStorage.single("photo"), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;
        const animalId = req.params.animalId;
        const userId = req.authInfos.userId;
        const pet = await Animal.findOne({where: {id: animalId}});
        if (!pet)
            {
                res.status(404).json({message: "This animal does not exist"})
        } else if(pet.userId !== userId)
        {
            res.status(403).json({message: "You don't have access to this animal"})
        }
        else{
            try {
                await uploadToSFTP(buffer, Folder.Pictures, filename);
                const animalPicture = await AnimalPictures.create({animalId, filename});
                res.status(200).send(animalPicture);
            } catch (e) {
                console.log(e);
                res.status(400).send({message: "Unable to save the picture"})
            }
        }
    } catch(e){
        console.log(e);
        res.status(400).send({message:"Couldn't upload the file"})
    }

});

export {uploadRouter}