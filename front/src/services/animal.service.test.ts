import { AnimalService } from "./animal.service";
import { httpClient } from "../helpers";
import { Animal, Specie, Picture } from "../models";

const get = jest.spyOn(httpClient, "get");
const post = jest.spyOn(httpClient, "post");
const put = jest.spyOn(httpClient, "put");
const del = jest.spyOn(httpClient, "delete");

const animals: Animal[] = [{
	id: 1,
	userId: 1,
	specieId: 1,
	birthdate: new Date(),
	name: 'Test1'
},
{
	id: 2,
	userId: 1,
	specieId: 2,
	birthdate: new Date(),
	name: 'Test2',
	events: [{
		id: 1,
		name: 'Réunion1',
		beginDate: new Date(),
		endDate: new Date(),
		description: 'Réunion décrite'
	}]
}]

const species: Specie[] = [{ id: 1, name: 'chat'}, { id: 2, name: 'chien'}];

const pictures: Picture[] = [{ id: 1, filename: 'file.jpg' }];

beforeEach(() => {
	jest.resetAllMocks();
});

test('Get all species', async () => {
	get.mockResolvedValue(species);
	await AnimalService.getSpecies().then(s => {
		expect(s).toStrictEqual(species);
    });
});

test('Get all animals', async () => {
	get.mockResolvedValue(animals);
	await AnimalService.getAll(1).then(a => {
		expect(a).toStrictEqual(animals);
    });
});

test('Get no animals', async () => {
	get.mockRejectedValue('Error');
	await AnimalService.getAll(1).catch(e => expect(e).toBeDefined());
	expect.assertions(1);
});

test('Get single animal', async () => {
    get.mockResolvedValue(animals[0]);
    await AnimalService.getSingle(0).then(a => {
        expect(a).toStrictEqual(animals[0]);
        expect(a.birthdate).toBeInstanceOf(Date);
    })
    expect.assertions(2);
})

test('Retrieve pictures', async () => {
    get.mockResolvedValue(pictures);
    await AnimalService.getPictures(1).then(p => {
        expect(p).toStrictEqual(pictures);
    })
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
    jest.spyOn(AnimalService, "getSingle").mockResolvedValue(animals[0]);
	del.mockResolvedValueOnce(null)
		.mockRejectedValueOnce('Error');
	await AnimalService.delete(0).then(e => expect(e).toBeNull());
	await AnimalService.delete(0).catch(e => expect(e).toBe(`Erreur lors de la suppression de l’animal d’identifiant 0`));
	expect(del).toBeCalledTimes(2);
	expect.assertions(3);
});
