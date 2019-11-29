import { Request, Response, Router } from 'express';
import {tempUpload} from "../../core/upload/tempStorage";
import {uploadToSFTP} from "../../core/upload/ftp";

const uploadRouter = Router();

uploadRouter.post('/photo',tempUpload.single("photo"),async (req:Request, res:Response) => {
    try {
        await uploadToSFTP(req.file.path, req.file.filename);
        res.sendStatus(200);
    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Couldn't upload the file"})
    }

});

export { uploadRouter }

