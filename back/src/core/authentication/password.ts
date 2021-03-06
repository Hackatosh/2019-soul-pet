/***
 * This file wraps basic password operation provided by bcrypt.
 ***/

import {User} from "../../database/models/user";
import {compare, hash} from "bcryptjs";
import {isEmptyString} from "../utils";

/***
 * Compare user.password field to a given password string using bcrypt compare function.
 * The function is asynchronous for performance reasons.
 ***/

const compareUserPassword = async function (user: User, password: string): Promise<boolean> {
    if (user === undefined || user === null || user.hashedPassword === undefined || user.hashedPassword === null) {
        return false;
    } else {
        return await compare(password, user.hashedPassword);
    }
};

/***
 * The function hash a given password using bcrypt hash function.
 * The function is asynchronous for performance reasons.
 ***/

const hashPassword = async function (password: string): Promise<string> {
    if (isEmptyString(password)) {
        throw new Error("Cannot hash empty password")
    }
    return await hash(password, 10);
};

export {compareUserPassword, hashPassword}