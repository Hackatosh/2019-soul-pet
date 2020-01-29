import { httpClient } from "../helpers";
import { EventComment } from "../models";
import { CommentsService } from "./comments.service";
import { AuthenticationService } from "./authentication.service";

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
	await CommentsService.post(comment).catch(e => expect(e).toBeDefined());
	comment.text = 'B';
	await CommentsService.post(comment).then(c => {
		expect((post.mock.calls[0][1] as EventComment).userId).toBe(0);
	});
	expect.assertions(2);
});
