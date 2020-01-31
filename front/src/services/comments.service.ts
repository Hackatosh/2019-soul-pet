import { EventComment } from "../models";
import { httpClient } from "../helpers";

export class CommentsService {
	/**
	 * Posts a comment to an event.
	 * @param comment the comment to post
	 * @returns the saved comment
	 */
	static async post(comment: EventComment): Promise<EventComment> {
		if (comment.text.trim().length === 0)
			return Promise.reject('Votre commentaire est vide.');
		return httpClient.post(`/comments/`, comment, true).then(c => {
			c.createdAt = new Date(c.createdAt);
			return c;
		}).catch(() => Promise.reject('Erreur lors de l’envoi du commentaire'));
	}
}
