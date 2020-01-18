/*** This file defines the storage used directly on the NodeJS server ***/

// @ts-ignore
import multer, {Multer} from 'multer'
import {NextFunction, Request, Response} from "express";
import * as path from "path";
import {ContentType} from "./ftp";

const message = "Error: unsupported picture filetype";

/*** Filter to only accept files corresponding to pictures ***/
const picturesFilter = function (req:Request, file:Multer.File, cb:(error: Error | null, acceptFile: boolean) => void) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error(message), false);
};

const pictureErrorMW = function (err:Error, req:Request, res:Response, next: NextFunction) {
    if(err.message === message){
        res.status(400).send({message:"Unsupported picture filetype. Please send JPEG, JPG, PNG or GIF file."})
    } else {
        next();
    }
};

/***
 * Resolve the ContentType of a given picture
 ***/

const resolvePictureContentType = function(file:Multer.File):ContentType {
    const mimetype = file.mimetype;
    if(/jpeg|jpg/.test(mimetype)){
        return ContentType.JPEG;
    } else if(/png/.test(mimetype)){
        return ContentType.PNG;
    } else if(/gif/.test(mimetype)){
        return ContentType.GIF;
    } else {
        return null;
    }
};

/*** In memory storage : nothing is written on the disk ***/
const memoryStorage = multer.memoryStorage();
const inMemoryStoragePicture = multer({fileFilter:picturesFilter, storage:memoryStorage});

const createPictureStorage = function (fieldName: string) {
    return [inMemoryStoragePicture.single(fieldName), pictureErrorMW];
};


export { createPictureStorage, resolvePictureContentType }