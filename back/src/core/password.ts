import {User} from "../database/models/user";
import bcrypt from "bcryptjs";

const compareUserPassword = async function(user:User,password:string){
    const areEquals = await bcrypt.compare(password,user.hashedPassword,);
    return areEquals;
};

const hashPassword = async function(password:string){
    const h = await bcrypt.hash(password,10);
    return h
};

export { compareUserPassword, hashPassword}