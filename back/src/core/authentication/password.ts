import {User} from "../../database/models/user";
import bcrypt from "bcryptjs";

const compareUserPassword = async function(user:User,password:string){
    return bcrypt.compare(password,user.hashedPassword,);
};

const hashPassword = async function(password:string){
    return  bcrypt.hash(password,10);
};

export { compareUserPassword, hashPassword}