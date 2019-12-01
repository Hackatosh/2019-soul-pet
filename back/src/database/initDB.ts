import {initUserModel} from "./models/user";
import {initTokenModel} from "./models/token";
import {db} from "./connection";

const initDB = async function () {
    await db.authenticate();
    await initUserModel();
    await initTokenModel();
};

export {initDB}