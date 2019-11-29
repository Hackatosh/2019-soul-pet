import Client from 'ssh2-sftp-client';
import {ConnectConfig} from 'ssh2'
import {env} from '../../config/env'

const config:ConnectConfig = {
    host: env.FTP_HOST,
    port: parseInt(env.FTP_PORT),
    username: env.FTP_USER,
    password: env.FTP_PASSWORD,
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

const uploadToSFTP = async function(src:string,destPath:string):Promise<void>{
    if(destPath.indexOf("/") !== -1){
        throw new Error("Can not create new path in distant SFTP")
    }
    let sftp = new Client();
    await sftp.connect(config);
    await sftp.fastPut(src,`${env.FTP_PATH}/${destPath}`);
    await sftp.end();
};

export { uploadToSFTP }