/***
 * This file defines the storage used directly on the NodeJS server to store pictures temporarily.
 ***/

// @ts-ignore
import multer, {Multer} from 'multer'
import {NextFunction, Request, Response} from "express";
import * as path from "path";
import {ContentType} from "./ftp";

const message = "Error: unsupported picture filetype";

/***
 * Filter to only accept files corresponding to common pictures extensions : JPEG, JPG, PNG and GIF.
 ***/
const picturesFilter = function (req: Request, file: Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error(message), false);
};

/***
 * Middleware used to handle the error thrown by the picturesFilter function.
 ***/
const pictureErrorMW = function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.message === message) {
        res.status(400).json({message: "Unsupported picture filetype. Please send JPEG, JPG, PNG or GIF file."})
    } else {
        next();
    }
};

/***
 * Resolve the ContentType of a given picture file.
 ***/

const resolvePictureContentType = function (file: Multer.File): ContentType {
    const mimetype = file.mimetype;
    if (/jpeg|jpg/.test(mimetype)) {
        return ContentType.JPEG;
    } else if (/png/.test(mimetype)) {
        return ContentType.PNG;
    } else if (/gif/.test(mimetype)) {
        return ContentType.GIF;
    } else {
        return null;
    }
};

/***
 * In memory storage : nothing is written on the disk.
 ***/
const memoryStorage = multer.memoryStorage();
const inMemoryStoragePicture = multer({fileFilter: picturesFilter, storage: memoryStorage});

/***
 * Factory used to create a middleware which handle form-data POST requests which contains a picture.
 * The middleware fills the req.file attribute using the file provided in the [fieldName] field in the form.
 * The middleware handle incorrects mimetypes for pictures, such as pdf, by responding a 400 Bad Request error.
 ***/
const createPictureStorage = function (fieldName: string) {
    return [inMemoryStoragePicture.single(fieldName), pictureErrorMW];
};


export {createPictureStorage, resolvePictureContentType}