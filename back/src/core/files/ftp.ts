/***
 * This file defines the CRUD operations used to interact with the SFTP server.
 ***/

import Client from 'ssh2-sftp-client';
import {ConnectConfig} from 'ssh2'
import {WriteStreamOptions} from 'ssh2-streams'
import {env} from '../../config/env'
import {join} from 'path';
import {Response} from "express";
import {HttpHeader, isEmptyString, objectifyHeadersArray} from "../utils";
import {v4} from "uuid";
import {logger} from "../logger";

/***
 * CONFIGURATION DEFINITION
 ***/

/***
 * Configuration needed for the client to connect to the SFTP server.
 ***/

const config: ConnectConfig = {
    host: env.FTP_HOST,
    port: env.FTP_PORT,
    username: env.FTP_USER,
    password: env.FTP_PASSWORD,
};

/***
 * Write options for the SFTP client.
 ***/

const putOptions: WriteStreamOptions = {
    flags: 'w',
    encoding: null,
    mode: 0o666,
};

/***
 * TYPES AND CLASSES DEFINITIONS
 ***/

/***
 * Wrapper to facilitate return types for read operations.
 ***/

type SFTPStream = string | NodeJS.ReadableStream | Buffer;

/***
 * Class representing a stream read from a file in the SFTP and a function to end the operation.
 ***/

export class SFTPPipe {
    public readonly stream: SFTPStream;
    public readonly end: () => Promise<void>;

    constructor(stream: string | NodeJS.ReadableStream | Buffer, end: () => Promise<void>) {
        this.stream = stream;
        this.end = end;
    }
}

/***
 * Enum representing the folders accessible in the SFTP.
 ***/

export enum Folder {
    AnimalPictures = 0,
    EventPictures = 1,
}

/***
 * Enum representing the content types that can be put in and retrieved from the SFTP.
 ***/

export enum ContentType {
    PNG = 0,
    JPEG = 1,
    GIF = 2,
}

/***
 * BASIC FUNCTIONS
 ***/

/***
 * Check if a given filename is valid.
 ***/

const checkFilenameForSFTP = function (filename: string): boolean {
    if (isEmptyString(filename)) {
        throw new Error("Invalid filename : empty.")
    }
    if (filename.indexOf("/") !== -1) {
        throw new Error("Invalid filename : contains forbidden characters.")
    }
    return true;
};

/***
 * Get the full path of a file given an accessible folder and a filename.
 * Throw an exception if the filename is invalid.
 ***/

const resolvePath = function (folder: Folder, filename: string): string {
    checkFilenameForSFTP(filename);
    switch (folder) {
        case Folder.AnimalPictures:
            return join(env.FTP_PATH_ANIMAL_PICTURES, filename);
        case Folder.EventPictures:
            return join(env.FTP_PATH_EVENT_PICTURES, filename);
        default:
            throw new Error("Unable to resolve folder path")
    }
};

/***
 * Generate a Content-Type HttpHeader based on the provided ContentType.
 ***/

const generateContentTypeHeader = function (contentType: ContentType): HttpHeader {
    switch (contentType) {
        //For .png files
        case ContentType.PNG:
            return new HttpHeader("Content-Type", "image/png");
        // For .jpg and .jpeg files
        case ContentType.JPEG:
            return new HttpHeader("Content-Type", "image/jpeg");
        // For .gif files
        case ContentType.GIF:
            return new HttpHeader("Content-Type", "image/gif");
        default:
            throw new Error("Unimplemented content type. This is needed for no sniff header.")
    }
};

/***
 * Generate a Content-Length HttpHeader based on the length of the SFTPStream from the SFTPPipe.
 ***/

const generateContentLengthHeader = function (sftpPipe: SFTPPipe): HttpHeader {
    if (typeof sftpPipe.stream === 'string') {
        return new HttpHeader("Content-Length", sftpPipe.stream.length.toString())
    } else if (sftpPipe.stream instanceof Buffer) {
        return new HttpHeader("Content-Length", sftpPipe.stream.length.toString())
    } else {
        return null; //Readable Stream has no defined length
    }
};

/***
 * BUSINESS LOGIC
 ***/

/***
 * Upload the provided buffer to the SFTP location obtained by resolving the provided destFolder and destFilename.
 * Generate a random filename.
 ***/

const uploadToSFTP = async function (src: Buffer, destFolder: Folder): Promise<string> {
    let sftp = new Client();
    const destFilename = v4();
    let sftpPath = resolvePath(destFolder, destFilename);
    try {
        await sftp.connect(config);
        await sftp.put(src, sftpPath, putOptions);
    } catch (e) {
        logger.error(e);
        throw new Error("Unable to upload file")
    } finally {
        await sftp.end();
    }
    return destFilename;
};

/***
 * Create an SFTPPipe for the SFTP location obtained by resolving the provided remoteFolder and remoteFilename.
 ***/

const createSFTPPipe = async function (remoteFolder: Folder, remoteFilename: string): Promise<SFTPPipe> {
    let sftp = new Client();
    let sftpPath = resolvePath(remoteFolder, remoteFilename);
    try {
        await sftp.connect(config);
        return new SFTPPipe(await sftp.get(sftpPath), sftp.end);
    } catch (e) {
        throw new Error("Unable to create a pipe to download file");
    }
};

/***
 * Create an SFTP Pipe and pipe it into a Response object from Express. Used to fully abstract the SFTP Layer from controllers.
 ***/

const pipeSFTPIntoResponse = async function (res: Response, remoteFolder: Folder, remoteFilename: string, contentType: ContentType): Promise<void> {
    const sftpPipe = await createSFTPPipe(remoteFolder, remoteFilename);
    try {
        const headers: Array<HttpHeader> = [generateContentTypeHeader(contentType), generateContentLengthHeader(sftpPipe)];
        res.writeHead(200, objectifyHeadersArray(headers));
        res.end(sftpPipe.stream);
    } catch (e) {
        throw new Error("Problem when piping into response object")
    } finally {
        try {
            await sftpPipe.end();
        } catch (e) {
            //Swallow exception thrown by clean up
        }
    }
};

/***
 * Delete the file corresponding to the SFTP location obtained by resolving the provided destFolder and destFilename.
 ***/

const deleteFromSFTP = async function (destFolder: Folder, destFilename: string): Promise<void> {
    let sftp = new Client();
    let sftpPath = resolvePath(destFolder, destFilename);
    try {
        await sftp.connect(config);
        await sftp.delete(sftpPath);
    } catch (e) {
        throw new Error("Unable to delete file")
    } finally {
        await sftp.end();
    }
};

export {uploadToSFTP, pipeSFTPIntoResponse, deleteFromSFTP}