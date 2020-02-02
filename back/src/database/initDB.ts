/***
 * This file contains the script used to initialize the DB.
 * Please note that this is kept separate from connection.ts to avoid circular import problems.
 ***/

import {initUserModel} from "./models/user";
import {initTokenModel} from "./models/token";
import {db} from "./connection";
import {initSpecieModel, specieModelFill} from "./models/specie";
import {initAssociations} from "./associations";
import {initAnimalModel} from "./models/animal";
import {initPetEventModel} from "./models/event";
import {initAnimalPicturesModel} from "./models/animalPicture";
import {initEventCommentModel} from "./models/eventComment";
import {initEventPicturesModel} from "./models/eventPicture";
import {logger} from "../core/logger";

/***
 * This function is used to wait until the DB is ready, unless the number of maxTry is reached.
 ***/

const waitForDB = async function (maxTry: number): Promise<void> {
    let isNotReady = true;
    let tryNumber = 1;
    while (isNotReady) {
        try {
            logger.info(`Checking if DB is ready. Try n°${tryNumber}`);
            await db.authenticate();
            isNotReady = false;
            logger.info('DB ready !')
        } catch (e) {
            logger.info('DB not available. Trying again in 15 seconds.');
            tryNumber++;
            if (tryNumber > maxTry) {
                logger.error("Max number of try to connect to DB exceded while waiting");
                logger.error(e);
                throw new Error("Max number of try to connect to DB exceded while waiting")
            }
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }
    return;
};

/***
 * This function waits until DB is ready and initializes all the models.
 ***/

const initDB = async function (): Promise<void> {
    try {
        logger.info("Initializing DB...");
        await waitForDB(100);
        await initUserModel();
        await initTokenModel();
        await initSpecieModel();
        await initAnimalModel();
        await initPetEventModel();
        await initAnimalPicturesModel();
        await initEventCommentModel();
        await initEventPicturesModel();
        await initAssociations();
        await db.sync();
        await specieModelFill();
        logger.info("DB initialized successfully");
    } catch (e) {
        logger.error(e);
        throw new Error("Problem when initializing the DB.")
    }
};

export {initDB}
