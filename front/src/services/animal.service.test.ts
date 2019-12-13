import { AnimalService } from "./animal.service";
import { httpClient } from "../helpers";
import { Animal } from "../models";

const get = jest.spyOn(httpClient, "get");
const post = jest.spyOn(httpClient, "post");
const put = jest.spyOn(httpClient, "put");
const del = jest.spyOn(httpClient, "delete");

const getAnimals = jest.spyOn(AnimalService, "get");

const animals: Animal[] = [{
	id: 1,
	userId: 1,
	specieId: 1,
	birthDate: new Date(),
	name: 'Test1'
},
{
	id: 2,
	userId: 1,
	specieId: 2,
	birthDate: new Date(),
	name: 'Test2',
	events: [{
		id: 1,
		name: 'Réunion1',
		beginDate: new Date(),
		endDate: new Date(),
		description: 'Réunion décrite'
	}]
}]

beforeEach(() => {
	jest.resetAllMocks();
});

test('Get all animals', async () => {
	get.mockResolvedValue(animals);
	await AnimalService.getAll().then(a => {
		expect(a).toStrictEqual(animals);
	});
});

test('Get no animals', async () => {
	get.mockRejectedValue('Error');
	await AnimalService.getAll().then(a => {
		expect(a).toHaveLength(0);
	});
	expect.assertions(1);
});

test('Add an animal', async () => {
	post.mockResolvedValueOnce(animals[0])
		.mockRejectedValueOnce('Error');
	await AnimalService.add(animals[0]).then(a => {
		expect(a).toStrictEqual(animals[0]);
	});
	await AnimalService.add(animals[0]).catch(e => {
		expect(e).not.toBe('Error');
	});
	expect.assertions(2);
});

test('Edit an animal', async () => {
	put.mockResolvedValueOnce(animals[0])
		.mockRejectedValueOnce('Error');
	await AnimalService.update(animals[0]).then(a => {
		expect(a).toStrictEqual(animals[0]);
	});
	await AnimalService.update(animals[0]).catch(e => {
		expect(e).not.toBe('Error');
	});
	expect.assertions(2);
});

test('Delete animal', async () => {
	getAnimals.mockResolvedValue(animals[0]);
	del.mockResolvedValueOnce(null)
		.mockRejectedValueOnce('Error');
	await AnimalService.delete(0).then(e => expect(e).toBeNull());
	await AnimalService.delete(0).catch(e => expect(e).toBe(`Erreur lors de la suppression de ${animals[0].name}`));
	expect(del).toBeCalledTimes(2);
	expect.assertions(3);
});

test('Delete animal not found', async () => {
	getAnimals.mockRejectedValueOnce('Erreur lors de la récupération de l’animal');
	await AnimalService.delete(0).catch(e => expect(e).toBe('Animal introuvable'));
	expect(del).not.toBeCalled();
	expect.assertions(2);
})
