import { httpClient } from "../helpers";
import { PetEvent } from "../models";
import { EventService } from "./event.service";

const get = jest.spyOn(httpClient, "get");
const post = jest.spyOn(httpClient, "post");
const put = jest.spyOn(httpClient, "put");
const del = jest.spyOn(httpClient, "delete");

const events: PetEvent[] = [{
	id: 1,
	name: '',
	beginDate: new Date(),
	endDate: new Date(),
	description: '',
	authorizedSpecies: [{ id: 0, name: '' }],
	eventComments: [{ userId: 0, eventId: 1, text: '', createdAt: new Date() }]
},
{
	id: 2,
	name: '',
	beginDate: new Date(),
	endDate: new Date(),
	description: ''
}]

beforeEach(() => {
	jest.resetAllMocks();
});

test('Event errors', async () => {
	get.mockRejectedValue('');
	post.mockRejectedValue('');
	del.mockRejectedValue('');
	await EventService.getAll().catch(e => expect(e).toBeDefined());
	await EventService.add(events[0]).catch(e => expect(e).toBeDefined());
	await EventService.delete(1).catch(e => expect(e).toBeDefined());
	expect.assertions(3);
});

test('Get all events', async () => {
	get.mockResolvedValue(events);
	await EventService.getAll().then(e => expect(e).toStrictEqual(events));
});

test('Get single event', async () => {
	get.mockResolvedValue(events[0]);
	await EventService.get(1).then(e => {
		expect(e).toStrictEqual(events[0]);
		expect(get).toHaveBeenCalledWith('/events/1', true);
	});
	expect.assertions(2);
});

test('Add event', async () => {
	post.mockResolvedValue(events[0]);
	await EventService.add(events[0]).then(e => {
		expect(e.specieIds).toBeDefined();
		expect(e.authorizedSpecies).toStrictEqual(events[0].authorizedSpecies);
	});
	expect.assertions(2);
});

test('Update event', async () => {
	put.mockResolvedValue(events[1]);
	await EventService.update(events[1]).then(e => {
		expect(e).toStrictEqual(events[1]);
	});
	expect.assertions(1);
});

test('Delete event', async () => {
	del.mockResolvedValue(null);
	await EventService.delete(1).then(e => {
		expect(e).toBeNull();
		expect(del).toHaveBeenCalledWith('/events/1', true);
	});
	expect.assertions(2);
});

test('Add animal to event', async () => {
	post.mockResolvedValue({ animalId: 1 });
	await EventService.addAnimal(1, 1).then(o => {
		expect(post).toHaveBeenCalledWith('/events/1/animals', { animalId: 1 }, true);
		expect(o).toBeNull();
	});
});

test('Remove animal from event', async () => {
	del.mockResolvedValue(null);
	await EventService.removeAnimal(1, 1).then(o => {
		expect(del).toHaveBeenCalledWith('/events/1/animals/1', true);
		expect(o).toBeNull();
	});
});
