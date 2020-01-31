import { httpClient } from "../helpers";
import { Picture, Directory } from "../models";
import { PictureService } from "./picture.service";

const get = jest.spyOn(httpClient, "get");

const picture: Picture = {id: 0, filename: 'image.jpg', content: ''};

test('Get picture error', async () => {
	get.mockRejectedValue('');
	await PictureService.loadPictureContent(Directory.Animals, picture).catch(_ => expect(get.mock.calls[0][0]).toBe(`/pictures/${Directory.Animals}/?filename=${picture.filename}`));
	expect.assertions(1);
});

test('Get picture', async () => {
	const blob = new Blob();
	get.mockResolvedValue(blob);
	Object.defineProperty(window.URL, 'createObjectURL', { value: () => {} });
	await PictureService.loadPictureContent(Directory.Animals, picture).then(p => {
		expect(p.content).toBe(URL.createObjectURL(blob));
	});
	expect.assertions(1);
});
