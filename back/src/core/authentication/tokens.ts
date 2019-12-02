/*** This file contains all the operations needed to work with JWT Token : generation and verification.
 * A database persistence has been added to allow revocation (see Token Model).***/

import {TokenPayload} from "./authenticationInterfaces";
import {sign, verify} from "jsonwebtoken";
import {env} from "../../config/env";
import {User} from "../../database/models/user";
import {Token} from "../../database/models/token";
import {isEmptyString} from "../utils";

/*** Generate a JWT token with a payload for a user using the SECRET KEY from env variables.
 * Token is persisted in database to allow revocation.***/
const generateTokenForUser = async function (user:User):Promise<string> {
    const token = sign(Object.assign({},new TokenPayload(user.id,Math.floor(Date.now() / 1000))), env.SECRET_KEY);
    try {
        await Token.create({token: token, userId: user.id});
    } catch (e) {
        throw new Error("Unable to create or persist token");
    }
    return token;
};

/*** Verify if a JWT Token is valid and decode the authentication informations contained in its payload.
 * A check in DB is performed to see if the token has not been revocated. ***/
const getAuthInfosFromToken = async function(token:string): Promise<TokenPayload>{
    let tokenPayload:TokenPayload;
    try{
        const decode:any = await verify(token,env.SECRET_KEY);
        tokenPayload = new TokenPayload(parseInt(decode.id),parseInt(decode.iat));
    } catch (e) {
        throw new Error("Invalid token");
    }
    if (tokenPayload.iat > Math.floor(Date.now() / 1000) + env.TOKEN_LIFETIME_SEC){
        throw new Error("Token expired");
    }
    let foundToken;
    try {
        foundToken = await Token.findOne(({where: {token: token}}));
    } catch (e) {
        throw new Error("Unable to check DB for token.");
    }
    if (!foundToken) {
        throw new Error("No token found in DB.");
    }
    return tokenPayload;
};

/*** Revocate a given token using database persistence ***/
const revocateToken = async function (token:string):Promise<void> {
    if(isEmptyString(token)){
        throw new Error("Cannot revocate empty token");
    }
    try {
        await Token.destroy({where: {token: token}});
    } catch (e) {
        throw new Error("Unable to destroy token.");
    }
};

/*** Revocate all tokens for a given user using database persistence ***/
const revocateAllTokensForUser = async function (userId:number) {
    try {
        await Token.destroy({where: {userId: userId}});
    } catch (e) {
    throw new Error("Unable to destroy tokens.");
}
};

export { generateTokenForUser, getAuthInfosFromToken, revocateToken, revocateAllTokensForUser }