/*** This file extends Express Request to add Authentication infos. This is used with the loginRequired middleware***/

import { Request } from 'express';

class TokenPayload {
    userId:number;
    iat:number;

    constructor(userId: number,iat:number) {
        this.userId = userId;
        this.iat = iat;
    }
}

interface AuthenticatedRequest extends Request{
    rawToken:string;
    authInfos: TokenPayload;
}

export { TokenPayload, AuthenticatedRequest}