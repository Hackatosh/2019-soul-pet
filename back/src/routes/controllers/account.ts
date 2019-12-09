import { Response, Router } from 'express';
import { User } from '../../database/models/user'
import {hashPassword} from "../../core/authentication/password";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {revocateAllTokensForUser} from "../../core/authentication/tokens";

const accountRouter = Router();

const putAccountChecks = [
  check('userId').notEmpty().isNumeric(),
  check('newPassword').notEmpty().isString().optional(),
  check('username').notEmpty().isString().optional(),
  check('email').notEmpty().isEmail().optional()
];

accountRouter.put('/:userId', putAccountChecks,inputValidationMW, async (req: AuthenticatedRequest,res: Response) => {
  const userId = parseInt(req.params.userId);
  const authenticatedId = req.authInfos.userId;
  const newPassword =  req.body.password;
  const newUsername = req.body.username;
  const newEmail = req.body.email;

  let update: any = {};

  if (newUsername) {
    update['username'] = newUsername;
  }
  if (newEmail) {
    update["email"] = newEmail;
  }

  if (newPassword) {
    update["hashedPassword"] = await hashPassword(newPassword);
  }

  if (authenticatedId === userId) {
    try {
      await User.update(update, {where: {id: userId}});
      update["hashedPassword"]=null;
      res.status(200).json({update: update});
      if (Object.keys(update).length !=0){
        await revocateAllTokensForUser(userId);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({errorMessage: "Unable to update the account"});
    }
  } else {
    res.status(403).json({errorMessage: "You don't have access to this user id"})
  }
}
);


accountRouter.delete('/:userId', async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    const authenticatedId = req.authInfos.userId;
    if (userId === authenticatedId) {
      User.destroy({where: {id: userId}});
      res.status(200).json({AccountDeleted : userId});
      await revocateAllTokensForUser(userId);

    } else {
      res.status(403).json({errorMessage: "You don't have access to this user id"})

    }

  });

export {accountRouter};
