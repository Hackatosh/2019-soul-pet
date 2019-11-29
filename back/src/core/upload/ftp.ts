import Client from 'ssh2-sftp-client';
import {ConnectConfig} from 'ssh2'
import {WriteStreamOptions} from 'ssh2-streams'
import {env} from '../../config/env'
import {join} from 'path';

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

const testFTPConnection = async function ():Promise<void> {
    try {
        console.log(config);
        let sftp = new Client();
        await sftp.connect(config);
        const p = await sftp.cwd();
        console.log(`Remote working directory is ${p}`);
        await sftp.end();
    } catch(e){
        console.log(`Error: ${e.message}`);
    }
};

const uploadToSFTP = async function(src:Buffer,destPath:string):Promise<void>{
    if(destPath.indexOf("/") !== -1){
        throw new Error("Can not create new path in distant SFTP")
    }
    let sftp = new Client();
    await sftp.connect(config);
    await sftp.put(src,join(env.FTP_PATH,destPath), putOptions);
    await sftp.end();
};

export { uploadToSFTP }