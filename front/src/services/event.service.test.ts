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
	authorizedSpecies: [{ id: 0, name: '' }]
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
		expect(e.specieIds).toHaveLength(1);
		expect(e).toStrictEqual(events[0]);
	});
	expect.assertions(3);
});

test('Update event', async () => {
	put.mockResolvedValue(events[1]);
	await EventService.update(events[1]).then(e => {
		expect(e.specieIds).toBeDefined();
		expect(e).toStrictEqual(events[1]);
	});
	expect.assertions(2);
});

test('Delete event', async () => {
	del.mockResolvedValue(null);
	await EventService.delete(1).then(e => {
		expect(e).toBeNull();
		expect(del).toHaveBeenCalledWith('/events/1', true);
	});
	expect.assertions(2);
});
