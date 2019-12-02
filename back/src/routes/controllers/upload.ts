import {Request, Response, Router} from 'express';
import {inMemoryStorage} from "../../core/files/localStorage";
import {ContentType, Folder, pipeSFTPIntoResponse, uploadToSFTP} from "../../core/files/ftp";

const uploadRouter = Router();

uploadRouter.post('/pictures',inMemoryStorage.single("photo"),async (req:Request, res:Response) => {
    try {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;
        await uploadToSFTP(buffer, Folder.Pictures, filename);
        res.sendStatus(200);
    } catch(e){
        res.status(400).send({errorMessage:"Couldn't upload the file"})
    }

});

uploadRouter.get('/pictures/:filename',async (req:Request, res:Response) => {
    try {
        const filename = req.params.filename;
        await pipeSFTPIntoResponse(res,Folder.Pictures, filename, ContentType.PNG)
    } catch(e){
        res.status(400).send({errorMessage:"Problem when downloading the file"})
    }
});

export { uploadRouter }

