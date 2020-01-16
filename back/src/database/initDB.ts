/*** This file contains the script used to initialize the DB.
 * Kept separate from connection.ts to avoid circular import problems. ***/

import {initUserModel} from "./models/user";
import {initTokenModel} from "./models/token";
import {db} from "./connection";
import {initSpecieModel, specieModelFill} from "./models/specie";
import {initAssociations} from "./associations";
import {initAnimalModel} from "./models/animal";
import {initPetEventModel} from "./models/event";
import {initEventCommentModel} from "./models/eventComment";

/*** Loop used to wait until the DB is ready, unless the number of maxTry is reached ***/
const waitForDB = async function (maxTry:number):Promise<void> {
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
            if(tryNumber>maxTry){
                console.log("Max number of try to connect to DB exceded while waiting");
                console.log(e);
                throw new Error("Max number of try to connect to DB exceded while waiting")
            }
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }
    return;
};

/*** Wait until DB is ready and initialized all the models ***/
const initDB = async function () {
    try {
        console.log("Initializing DB...");
        await waitForDB(100);
        await initUserModel();
        await initTokenModel();
        await initSpecieModel();
        await initAnimalModel();
        await initPetEventModel();
        await initEventCommentModel();
        await initAssociations();
        await db.sync();
        //await specieModelFill();
        console.log("DB initialized successfully");
    } catch (e) {
        throw new Error("Problem when initializing the DB.")
    }
};

export {initDB}