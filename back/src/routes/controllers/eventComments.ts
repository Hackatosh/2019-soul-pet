import {Response, Router} from "express";
import {AuthenticatedRequest} from "../../core/authentication/authenticationInterfaces";
import {check} from 'express-validator'
import {inputValidationMW} from "../middlewares/inputValidation";
import {PetEvent} from "../../database/models/event";
import {EventComment} from "../../database/models/eventComment";
import {User} from "../../database/models/user";
import {logger} from "../../core/logger";

const eventCommentsRouter = Router();

/***
 * This route is used to obtained the list of all the comments about events related to a specific user, identified by the provided userId.
 ***/

const getUserEventCommentsChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
];

eventCommentsRouter.get('/', getUserEventCommentsChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.query.userId);
    if (userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    const comments = await EventComment.findAll({where: {userId: userId}});
    res.status(200).json(comments)
});

/***
 * This route is used to obtained a specific comment about an event, identified by the provided commentId.
 ***/

const getCommentChecks = [
    check('commentId').notEmpty().isNumeric().withMessage("commentId must be a number"),
];

eventCommentsRouter.get('/:commentId', getCommentChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await EventComment.findOne({
        where: {id: commentId},
        include: [{model: User, attributes: ["username"]}]
    });
    if (!comment) {
        res.sendStatus(404).json({message: "Comment not found."});
    } else if (comment.userId != req.authInfos.userId) {
        res.sendStatus(403).json({message: "You don't have access to this comment."});
    } else {
        res.status(200).json(comment);
    }
});

/***
 * This route is used to create a new comment using the provided information.
 * The comment is associated to the event identified by the provided eventId and to the user identified by the provided userId.
 ***/

const postCommentChecks = [
    check('userId').notEmpty().isNumeric().withMessage("userId must be a number"),
    check('eventId').notEmpty().isNumeric().withMessage("eventId must be a number"),
    check('text').notEmpty().isString().isLength({max: 128}).withMessage("text must be a valid string shorter than 128 characters"),
];

eventCommentsRouter.post('/', postCommentChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.body.userId);
    const eventId = parseInt(req.body.eventId);
    const text = req.body.text;
    if (userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this user."});
        return;
    }
    if (!await PetEvent.findOne({where: {id: eventId}})) {
        res.status(400).json({message: "Bad request. The event you indicated does not exist in DB."});
        return;
    }
    try {
        const comment = await EventComment.create({userId, eventId, text});
        res.status(200).json(comment)
    } catch (e) {
        logger.error(e);
        res.status(500).json({message: "Unable to create the comment"})
    }
});

/***
 * This route is used to edit a comment, identified by the provided commentId.
 ***/

const putCommentChecks = [
    check('commentId').notEmpty().isNumeric().withMessage("eventId must be a number"),
    check('text').notEmpty().isString().isLength({max: 128}).withMessage("text must be a valid string shorter than 128 characters"),
];

eventCommentsRouter.put('/:commentId', putCommentChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const text = req.body.text;
    const commentFound = await EventComment.findOne({where: {id: commentId}});
    if (!commentFound) {
        res.status(404).json({message: "Not found. The comment you are trying to access does not exist."});
        return;
    }
    if (commentFound.userId !== req.authInfos.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this comment."});
        return;
    }
    await commentFound.setDataValue("text", text);
    await commentFound.save();
    res.status(200).json(commentFound);
});

/***
 * This route is used to delete a comment, identified by the provided commentId.
 ***/

const deleteCommentChecks = [
    check('commentId').notEmpty().isNumeric().withMessage("commentId must be a number"),
];

eventCommentsRouter.delete('/:commentId', deleteCommentChecks, inputValidationMW, async (req: AuthenticatedRequest, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await EventComment.findOne({where: {id: commentId}});
    if (!comment) {
        res.status(404).json({message: "Not found. The comment you are trying to access does not exist."});
        return;
    }
    if (req.authInfos.userId !== comment.userId) {
        res.status(403).json({message: "Forbidden. You don't have access to this comment."});
        return;
    }
    await EventComment.destroy({where: {id: commentId}});
    res.status(200).json({id: comment})
});

export {eventCommentsRouter}