import { httpClient } from "../helpers";
import { EventComment } from "../models";
import { AuthenticationService } from "./authentication.service";
import { CommentsService } from ".";

const post = jest.spyOn(httpClient, "post");

const comment: EventComment = {
	id: 0,
	userId: 0,
	eventId: 0,
	text: '',
	createdAt: new Date()
}

test('Post comment', async () => {
	post.mockResolvedValue(comment);
	jest.spyOn(AuthenticationService, "User", "get").mockReturnValue({ id: 1, email: '' });
	let error: string;
	await CommentsService.post(comment).catch(e => {
		expect(e).toBeDefined();
		error = e;	
		comment.text = 'B';
		CommentsService.post(comment).then(c => {
			expect((post.mock.calls[0][1] as EventComment).userId).toBe(0);
		});
		post.mockRejectedValueOnce('');
		CommentsService.post(comment).catch(e => {
			expect(e).not.toBe(error);
		});
	});
	expect.assertions(3);
});
