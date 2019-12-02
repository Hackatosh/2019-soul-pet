/*** This file extends Express Request to add Authentication infos. This is used with the loginRequired middleware***/

import { Request } from 'express';

class AuthenticationInfos {
    id:number;
    username:string;
    email:string;


    constructor(id: number, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

interface AuthenticatedRequest extends Request{
    user: AuthenticationInfos;
}

export { AuthenticationInfos, AuthenticatedRequest}