import {AuthenticationInfos} from "./authenticationInterfaces";
import {sign, verify} from "jsonwebtoken";
import {env} from "../../config/env";
import {User} from "../../database/models/user";
import {Token} from "../../database/models/token";
import {where} from "sequelize";

const generateTokenForUser = async function (user:User):Promise<string> {
    const token = sign(Object.assign({},new AuthenticationInfos(user.id)), env.SECRET_KEY);
    await Token.create({token:token,userId:user.id});
    return token;
};

const getAuthInfosFromToken = async function(token:string): Promise<AuthenticationInfos>{
    const decode:any = await verify(token,env.SECRET_KEY);
    const foundToken = await Token.findOne(({where: {token:token}}));
    if(!foundToken){
        throw new Error("No token found in DB.")
    }
    return new AuthenticationInfos(decode.id);
};

const revocateToken = async function (token:string):Promise<void> {
    Token.destroy({where:{token:token}});
};

const revocateAllTokensForUser = async function (userId:number) {
    Token.destroy({where:{userId:userId}});
};

export { generateTokenForUser, getAuthInfosFromToken, revocateToken, revocateAllTokensForUser }