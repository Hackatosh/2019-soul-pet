import { httpClient } from "../helpers";
import { Picture } from "../models";
import { PictureService } from "./picture.service";

const get = jest.spyOn(httpClient, "get");

const picture: Picture = {id: 0, filename: 'image.jpg', content: ''};

test('Get picture', async () => {
	get.mockRejectedValue('');
	await PictureService.loadPictureContent('repo', picture).catch(_ => expect(get.mock.calls[0][0]).toBe(`/pictures/repo/?filename=${picture.filename}`));
	expect.assertions(1);
});
