import { Request, Response, Router } from 'express';
import { User } from '../../database/models/user'
import {compareUserPassword, hashPassword} from "../../core/password";
import {sign} from 'jsonwebtoken';
import {env} from "../../config/env";
import {AuthenticationInfos} from "../../core/authenticationInterfaces";

const authenticationRouter = Router();

authenticationRouter.post('/register',async (req: Request, res: Response) => {
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

authenticationRouter.post('/login',async (req: Request, res: Response) => {
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