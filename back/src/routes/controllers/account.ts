import { Request, Response, Router } from 'express';
import { User } from '../../database/models/user'
import {compareUserPassword, hashPassword} from "../../core/authentication/password";
import {sign} from 'jsonwebtoken';
import {env} from "../../config/env";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {authenticationRouter} from "./authentication";
import moment from "moment";
import {Animal} from "../../database/models/animal";


const accountRouter = Router();

const putAccountChecks = [
  check('userId').notEmpty().isNumeric(),
  check('newPassword').notEmpty().isString().optional(),
  check('username').notEmpty().isString().optional(),
  check('email').notEmpty().isString().optional()
];

accountRouter.put('/:userId', putAccountChecks,inputValidationMW, async (req: AuthenticatedRequest,res: Response) => {
  const userId = parseInt(req.params.userId);
  const authenticatedId = req.authInfos.userId;
  const newPassword =  req.body.password;
  const newUsername = req.body.username;
  const newEmail = req.body.email;

  var update: any = {};

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
      let user = await User.update(update, {where: {id: authenticatedId}});
      update["hashedPassword"]=null;
      res.status(200).json({update: update});
    } catch (e) {
      console.log(e);
      res.status(400).json({errorMessage: "Unable to register"});
    }
  } else {
    res.status(403).json({errorMessage: "You don't have access to this user id"})
  }
}
);


accountRouter.delete('/:userId', (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    const authenticatedId = req.authInfos.userId;
    if (userId === authenticatedId) {
      let user = User.destroy({where: {id: authenticatedId}});
      res.status(200).json({deletionMessage : "The account was deleted"});

    } else {
      res.status(403).json({errorMessage: "You don't have access to this user id"})

    }

  });

export {accountRouter};
