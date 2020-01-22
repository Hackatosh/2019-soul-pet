/***
 * This files defines a router which DOES NOT REQUIRE ANY AUTHENTICATION and allows any user to register and login.
 ***/

import {Request, Response, Router} from 'express';
import {User} from '../../database/models/user'
import {compareUserPassword, hashPassword} from "../../core/authentication/password";
import {inputValidationMW} from "../middlewares/inputValidation";
import {check} from 'express-validator'
import {generateTokenForUser} from "../../core/authentication/tokens";

const authenticationRouter = Router();

/***
 * This route allows the creation of a user in the DB, using basic information provided in the request (username, password and email).
 ***/

const registerChecks = [
    check('username').isString().isLength({min: 3}).withMessage("username must be a valid string longer than 3 characters"),
    check('password').isString().isLength({min: 8}).withMessage("password must be a valid string longer than 8 characters"),
    check('email').isEmail().withMessage("email must be a valid email"),
];

authenticationRouter.post('/register', registerChecks, inputValidationMW, async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        let user = await User.create({username: username, hashedPassword: await hashPassword(password), email: email});
        user.hashedPassword = null;
        res.status(200).json(user)
    } catch (e) {
        console.log(e);
        res.status(400).json({message: "Unable to register"})
    }

});

/***
 * This route allows a user to authenticate using his email and password.
 * It then sends back a JWT token.
 * Note : a JWT token is created using the authentications infos of the user and the SECRET KEY defined in env object.
 ***/

const loginChecks = [
    check('password').isString().isLength({min: 8}).withMessage("password must be a valid string longer than 8 characters"),
    check('email').isEmail().withMessage("email must be a valid email"),
];

authenticationRouter.post('/login', loginChecks, inputValidationMW, async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne(({where: {email: email}}));
    if (!user) {
        res.status(401).json({message: "Authentication failed: user not found"})
    } else if (!(await compareUserPassword(user, password))) {
        res.status(401).json({message: "Authentication failed: invalid password"})
    } else {
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: await generateTokenForUser(user)
        })
    }
});

export {authenticationRouter}
