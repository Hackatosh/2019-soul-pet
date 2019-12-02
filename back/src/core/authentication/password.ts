/*** This file wraps basic password operation provided by bcrypt***/

import {User} from "../../database/models/user";
import bcrypt from "bcryptjs";
import {isEmptyString} from "../utils";

/*** Compare user.password field to password string using bcrypt compare. Async for performances. ***/
const compareUserPassword = async function(user:User,password:string):Promise<boolean>{
    if(user === undefined || user === null || user.hashedPassword === undefined || user.hashedPassword === null){
        return false;
    } else {
        return bcrypt.compare(password,user.hashedPassword);
    }
};

/*** Compare user.password field to password string using bcrypt compare. Async for performances. ***/
const hashPassword = async function(password:string){
    if(isEmptyString(password)){
        throw new Error("Cannot hash empty password")
    }
    return  bcrypt.hash(password,10);
};

export { compareUserPassword, hashPassword}