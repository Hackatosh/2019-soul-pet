import { Request, Response, Router } from 'express';
import {inMemoryStorage} from "../../core/upload/inMemoryStorage";
import {uploadToSFTP} from "../../core/upload/ftp";

const uploadRouter = Router();

// TODO : Size limit for photo
// TODO : Generate random name
// TODO : fix database
// TODO : fix sftp.put
uploadRouter.post('/photo',inMemoryStorage.single("photo"),async (req:Request, res:Response) => {
    try {
        await uploadToSFTP(req.file.buffer, req.file.originalname);
        res.sendStatus(200);
    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Couldn't upload the file"})
    }

});

export { uploadRouter }

