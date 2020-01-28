import { EventComment } from "../models";
import { httpClient } from "../helpers";
import { AuthenticationService } from "./authentication.service";

export class CommentsService {
	/**
	 * Posts a comment to an event.
	 * @param comment the comment to post
	 * @returns the saved comment
	 */
	static async post(comment: EventComment): Promise<EventComment> {
		comment.userId = AuthenticationService.User.id;
		return httpClient.post(`/comments/`, comment, true).catch(() => Promise.reject('Erreur lors de l’envoi du commentaire'));
	}
}
