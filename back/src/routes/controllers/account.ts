import { Request, Response, Router } from 'express';
import { User } from '../../database/models/user'
import {compareUserPassword, hashPassword} from "../../core/authentication/password";
import {sign} from 'jsonwebtoken';
import {env} from "../../config/env";
import {AuthenticatedRequest, AuthenticationInfos} from "../../core/authentication/authenticationInterfaces";


const usersRouter = Router();

usersRouter.put('/:userId'),async (req: AuthenticatedRequest,updateReq: Request, res: Response) =>{
  const authenticatedId = req.user.id;
  const newPassword  = req.body.newPassword;
  const userId = req.params.userId;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  var update:any = {};


  if (newUsername){
    update['username']= newUsername;
  }
  if (newEmail){
    update["email"]= newEmail;
  }

  if (authenticatedId ===  userId){
    try{
      let user = User.update(update,{ where: {id: authenticatedId }});
      if (newPassword){
        let user = await User.update({hashedPassword: await hashPassword(newPassword)},{ where: {id: authenticatedId } });
        user.hashedPassword = null;
      };
      res.status(200).json({user:user});
      } catch(e) {
        console.log(e);
        res.status(400).json({errorMessage:"Unable to register"});
      }
    }
    else{
      res.status(403).json({errorMessage:"You don't have access to this user id"})
    }


  usersRouter.delete('/:userId'), (req: AuthenticatedRequest,res: Response) => {
    const userId = req.params.userId;
    const authenticatedId = req.user.id;
    if (userId === authenticatedId){
      user = User.destroy({where: {id: authenticatedId } });
    }
    else{
      res.status(403).json({errorMessage:"You don't have access to this user id"})

    };
  }

  //userName et email => exceptions unique
