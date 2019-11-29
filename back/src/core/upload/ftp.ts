import Client from 'ssh2-sftp-client';
import {ConnectConfig} from 'ssh2'
import {env} from '../../config/env'

const config:ConnectConfig = {
    host: env.FTP_HOST,
    port: parseInt(env.FTP_PORT),
    username: env.FTP_USER,
    password: env.FTP_PASSWORD,
};

const testConnection = async function ():Promise<void> {
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

export { testConnection }