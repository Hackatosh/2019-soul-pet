/*** This file extends Express Request to add Authentication infos. This is used with the loginRequired middleware***/

import { Request } from 'express';

class AuthenticationInfos {
    userId:number;

    constructor(userId: number) {
        this.userId = userId;
    }
}

interface AuthenticatedRequest extends Request{
    token:string;
    user: AuthenticationInfos;
}

export { AuthenticationInfos, AuthenticatedRequest}