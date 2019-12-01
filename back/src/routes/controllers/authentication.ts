/*** This files defines a router which DOES NOT REQUIRE ANY AUTHENTICATION and allows the user to register and login ***/

import { Request, Response, Router } from 'express';
import { User } from '../../database/models/user'
import {compareUserPassword, hashPassword} from "../../core/authentication/password";
import {sign} from 'jsonwebtoken';
import {env} from "../../config/env";
import {AuthenticationInfos} from "../../core/authentication/authenticationInterfaces";
import {inputValidationMW} from "../middlewares/inputValidation";
import { check } from 'express-validator'

const authenticationRouter = Router();

/*** POST route used to create a user in the DB ***/

const registerChecks = [
    check('username').isString().isLength({ min: 3 }),
    check('password').isString().isLength({ min: 8 }),
    check('email').isEmail(),
];

authenticationRouter.post('/register',registerChecks, inputValidationMW, async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try{
        let user = await User.create({username:username,hashedPassword: await hashPassword(password), email:email});
        user.hashedPassword = null;
        res.status(200).json({user:user})
    } catch(e) {
        console.log(e)
        res.status(400).json({errorMessage:"Unable to register"})
    }

});

/*** POST route used to authenticate a user and send back a JWT token.
 * A JWT token is created using the authentications infos of the user and the SECRET KEY defined in env object. ***/

const loginChecks = [
    check('password').isString().isLength({ min: 8 }),
    check('email').isEmail(),
];

authenticationRouter.post('/login', loginChecks, inputValidationMW, async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne(({where: {email: email}}));
    if(!user){
        res.status(401).json({errorMessage:"Authentication failed. User not found"})
    }
    if(!(await compareUserPassword(user,password))){
        res.status(401).json({errorMessage:"Authentication failed. User not found"})
    } else {
        res.status(200).json({token:sign(Object.assign({},new AuthenticationInfos(user.id,user.username,user.email)), env.SECRET_KEY)})
    }
});

export {authenticationRouter}