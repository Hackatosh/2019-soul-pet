import {Request, Response, Router} from 'express';
import {inMemoryStorage} from "../../core/files/localStorage";
import {ContentType, Folder, pipeSFTPIntoResponse, uploadToSFTP} from "../../core/files/ftp";

const uploadTestRouter = Router();

uploadTestRouter.post('/pictures',inMemoryStorage.single("photo"),async (req:Request, res:Response) => {
    try {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;
        await uploadToSFTP(buffer, Folder.AnimalPictures, filename);
        res.sendStatus(200);
    } catch(e){
        console.log(e)
        res.status(400).send({message:"Couldn't upload the file"})
    }

});

uploadTestRouter.get('/pictures/:filename',async (req:Request, res:Response) => {
    try {
        const filename = req.params.filename;
        await pipeSFTPIntoResponse(res,Folder.AnimalPictures, filename, ContentType.PNG)
    } catch(e){
        res.status(400).send({message:"Problem when downloading the file"})
    }
});

export { uploadTestRouter }

