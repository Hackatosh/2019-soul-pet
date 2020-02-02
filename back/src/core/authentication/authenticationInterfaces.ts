/***
 * This file extends Express Request to add Authentication infos.
 * This is used with the loginRequiredMW middleware.
 ***/

import {Request} from 'express';

/***
 * Class representing the payload contained in a JWT token provided by the application.
 ***/

class TokenPayload {
    public readonly userId: number;
    public readonly iat: number; // iat stands for Issued AT

    constructor(userId: number, iat: number) {
        this.userId = userId;
        this.iat = iat;
    }
}

/***
 * Interface extending Express Request to include authentication infos decoded from JWT token.
 ***/

interface AuthenticatedRequest extends Request {
    rawToken: string;
    authInfos: TokenPayload;
}

export {TokenPayload, AuthenticatedRequest}