import {Response, Router} from 'express';
import {User} from '../../database/models/user'
import {hashPassword} from "../../core/authentication/password";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {revocateAllTokensForUser} from "../../core/authentication/tokens";
import {logger} from "../../core/logger";

const accountRouter = Router();

/***
 * This route allows to modify a specific user account, using the provided userId.
 * It allows to modify the username, password and email.
 ***/

const putAccountChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
    check('newPassword').isString().isLength({min: 8}).withMessage("newPassword should be a valid string longer than 8 characters").optional(),
    check('username').isString().isLength({min: 3}).withMessage("username should be a valid string longer than 3 characters").optional(),
    check('email').notEmpty().isEmail().withMessage("email should be a valid email").optional()
];

accountRouter.put('/:userId', putAccountChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
        const userId = parseInt(req.params.userId);
        const authenticatedId = req.authInfos.userId;
        const newPassword = req.body.password;
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
                update["hashedPassword"] = null;
                if (Object.keys(update).length != 0) {
                    await revocateAllTokensForUser(userId);
                }
                res.status(200).json(update);
            } catch (e) {
                logger.error(e);
                res.status(400).json({message: "Unable to update the account"});
            }
        } else {
            res.status(403).json({message: "You don't have access to this user id"})
        }
    }
);

/***
 * This route allows to delete a specific user account, using the provided userId.
 ***/

const deleteAccountChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
];

accountRouter.delete('/:userId', deleteAccountChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    const authenticatedId = req.authInfos.userId;
    if (userId === authenticatedId) {
        User.destroy({where: {id: userId}});
        res.status(200).json({id: userId});
        await revocateAllTokensForUser(userId);

    } else {
        res.status(403).json({message: "You don't have access to this user id"})

    }

});

export {accountRouter};
