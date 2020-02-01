import { httpClient } from "../helpers";
import { Picture, Directory } from "../models";
import { PictureService } from "./picture.service";

const get = jest.spyOn(httpClient, "get");
const post = jest.spyOn(httpClient, "post");
const del = jest.spyOn(httpClient, "delete");

const pictures: Picture[] = [{id: 0, filename: 'image.jpg', content: '', userId: 0}];

test('Get picture error', async () => {
	get.mockRejectedValue('');
	await PictureService.loadPictureContent(Directory.Animals, pictures[0]).catch(_ => expect(get.mock.calls[0][0]).toBe(`/pictures/${Directory.Animals}/?filename=${pictures[0].filename}`));
	expect.assertions(1);
});

test('Get picture', async () => {
	const blob = new Blob();
	get.mockResolvedValue(blob);
	Object.defineProperty(window.URL, 'createObjectURL', { value: () => {} });
	await PictureService.loadPictureContent(Directory.Animals, pictures[0]).then(p => {
		expect(p.content).toBe(URL.createObjectURL(blob));
	});
	expect.assertions(1);
});

test('Retrieve pictures', async () => {
	get.mockResolvedValue(pictures);
	await PictureService.getPictures(1, Directory.Animals).then(p => {
		expect(p).toStrictEqual(pictures);
	});
});

test('Post picture', async () => {
	const id = 0;
	post.mockResolvedValue(pictures[0]);
	await PictureService.postPicture(id, Directory.Animals, new Blob()).finally(() => {
		expect(post.mock.calls[0][0]).toBe(`/pictures/animals/${id}`);
		const form = new FormData();
		form.append('picture', new Blob());
		expect(post.mock.calls[0][1]).toStrictEqual(form);
	});
	expect.assertions(2);
});

test('Delete a picture', async () => {
	del.mockResolvedValue(null);
	await PictureService.deletePicture(pictures[0], Directory.Animals).finally(() => {
		expect(del.mock.calls[0][0]).toBe(`/pictures/animals/?filename=${pictures[0].filename}`);
	});
	expect.assertions(1);
})
