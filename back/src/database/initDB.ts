import {initUserModel} from "./models/user";
import {initTokenModel} from "./models/token";
import {db} from "./connection";

const waitForDB = async function ():Promise<void> {
    let isNotReady = true;
    let tryNumber = 1;
    while(isNotReady){
        try{
            console.log(`Checking if DB is ready. Try n°${tryNumber}`);
            await db.authenticate();
            isNotReady = false;
            console.log('DB ready !')
        }catch(e){
            console.log('DB not available. Trying again in 15 seconds.');
            tryNumber++;
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }
    return;
};

const initDB = async function () {
    console.log("Initializing DB...");
    await waitForDB();
    await initUserModel();
    await initTokenModel();
    console.log("DB initialized successfully");
};

export {initDB}