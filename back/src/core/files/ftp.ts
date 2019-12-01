/*** This file defines the logic used to interact with the SFTP server ***/

import Client from 'ssh2-sftp-client';
import {ConnectConfig} from 'ssh2'
import {WriteStreamOptions} from 'ssh2-streams'
import {env} from '../../config/env'
import {join} from 'path';
import {Response} from "express";
import {OutgoingHttpHeaders} from "http";
import {Header, objectifyHeadersArray} from "../utils";

/*** Configurations definitions ***/

const config:ConnectConfig = {
    host: env.FTP_HOST,
    port: parseInt(env.FTP_PORT),
    username: env.FTP_USER,
    password: env.FTP_PASSWORD,
};

const putOptions:WriteStreamOptions = {
    flags: 'w',
    encoding: null,
    mode: 0o666,
};

/*** Type definitions ***/

type SFTPStream = string | NodeJS.ReadableStream | Buffer;

export class SFTPPipe {
    public readonly stream: SFTPStream;
    public readonly end:()=>Promise<void>;

    constructor(stream: string | NodeJS.ReadableStream | Buffer, end: () => Promise<void>) {
        this.stream = stream;
        this.end = end;
    }
}

export enum Folder {
    Pictures,
}

export enum ContentType{
    PNG,
}


/*** Basic functions ***/

const resolvePath = function(folder:Folder,filename:string):string{
    if(filename.indexOf("/") !== -1){
        throw new Error("Trying to access a subfolder. This is not authorized.")
    }
    switch (folder) {
        case Folder.Pictures:
            return join(env.FTP_PATH_PICTURES,filename);
        default:
            throw new Error("Unable to resolve folder path")
    }
};

const generateContentTypeHeader = function (contentType:ContentType):Header {
    switch (contentType) {
        case ContentType.PNG:
            return new Header("Content-Type","image/png");
        default:
            throw new Error("Unimplemented content type")
    }
};

const generateContentLengthHeader = function (sftpPipe:SFTPPipe):Header {
    if(typeof sftpPipe.stream === 'string'){
        return new Header("Content-Length",sftpPipe.stream.length.toString())
    } else if (sftpPipe.stream instanceof Buffer){
        return new Header("Content-Length",sftpPipe.stream.length.toString())
    } else {
        return null; //Readable Stream has no defined length
    }
};

/*** Business Logic ***/

const uploadToSFTP = async function(src:Buffer,destFolder:Folder,destFilename:string):Promise<void>{
    if(destFilename.indexOf("/") !== -1){
        throw new Error("Can not create new folder in SFTP server")
    }
    let sftp = new Client();
    await sftp.connect(config);
    await sftp.put(src,resolvePath(destFolder,destFilename), putOptions);
    await sftp.end();
};

const createSFTPPipe = async function(remoteFolder:Folder, remoteFilename:string):Promise<SFTPPipe>{
    let sftp = new Client();
    await sftp.connect(config);
    return new SFTPPipe(await sftp.get(resolvePath(remoteFolder,remoteFilename)),sftp.end);
};

const pipeSFTPIntoResponse = async function(res:Response,remoteFolder:Folder, remoteFilename:string, contentType:ContentType) {
    if(remoteFilename.indexOf("/") !== -1){
        throw new Error("Wrong remote filename");
    }
    const sftpPipe = await createSFTPPipe(remoteFolder,remoteFilename);
    const headers:Array<Header> = [generateContentTypeHeader(contentType), generateContentLengthHeader(sftpPipe)];
    res.writeHead(200,objectifyHeadersArray(headers));
    res.end(sftpPipe.stream);
};

export { uploadToSFTP, pipeSFTPIntoResponse }