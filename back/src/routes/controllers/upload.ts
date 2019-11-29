import { Request, Response, Router } from 'express';
import {inMemoryStorage} from "../../core/files/inMemoryStorage";
import {pipeIntoSFTP, uploadToSFTP} from "../../core/files/ftp";

const uploadRouter = Router();

// TODO : Size limit for photo
// TODO : Generate random name
uploadRouter.post('/pictures',inMemoryStorage.single("photo"),async (req:Request, res:Response) => {
    try {
        await uploadToSFTP(req.file.buffer, req.file.originalname);
        res.sendStatus(200);
    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Couldn't files the file"})
    }

});

uploadRouter.get('/pictures/:filename',async (req:Request, res:Response) => {
    try {
        const pipe = await pipeIntoSFTP(req.params.filename);
        if(typeof pipe.stream === 'string'){
            const text = pipe.stream;
            res.status(200).send({text:text});
        } else if (pipe.stream instanceof Buffer){
            const buffer = pipe.stream.toString('base64');
            res.end(buffer);
        } else {
            pipe.stream.pipe(res);
            res.end();
        }

    } catch(e){
        console.log(e);
        res.status(400).send({errorMessage:"Problem when downloading the file"})
    }

});

export { uploadRouter }

