import {Response, Router} from 'express';
import {User} from '../../database/models/user'
import {hashPassword} from "../../core/authentication/password";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from "express-validator";
import {inputValidationMW} from "../middlewares/inputValidation";
import {revokeAllTokensForUser} from "../../core/authentication/tokens";
import {logger} from "../../core/logger";
import {PetEvent} from "../../database/models/event";
import {Animal} from "../../database/models/animal";
import {EventComment} from "../../database/models/eventComment";
import {EventPicture} from "../../database/models/eventPicture";

const accountRouter = Router();

/***
 * This route is used to get all public informations about a specific user, identified by the provided userId.
 * The information includes the list of the animals belonging to the user, the events he is organizing, the comments he has posted and the pictures he has uploaded for events.
 ***/

const getEventChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
];

accountRouter.get('/:userId', getEventChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    try {
        let userFound = await User.findOne({
            where: {id: userId},
            include: [{model: Animal}, {
                model: EventComment,
                as: "eventComments"
            }, {
                model: PetEvent,
                as: "events"
            }, {
                model: EventPicture,
                as: "eventPictures",
            }]
        });
        if (!userFound) {
            res.status(404).json({message: "Not found. The user you are trying to access does not exist."});
            return;
        }
        res.status(200).json(userFound)
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Error when retrieving the user."});
    }
});

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
                    await revokeAllTokensForUser(userId);
                }
                res.status(200).json(update);
            } catch (e) {
                logger.error(e);
                res.status(500).json({message: "Unable to update the account."});
            }
        } else {
            res.status(403).json({message: "You don't have access to this user id."})
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
        await revokeAllTokensForUser(userId);
    } else {
        res.status(403).json({message: "You don't have access to this user id."});
    }
});

export {accountRouter};
