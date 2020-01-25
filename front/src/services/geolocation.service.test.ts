import { GeolocationService } from "./geolocation.service";

const geolocation = {
	clearWatch: jest.fn(),
	watchPosition: jest.fn(),
	getCurrentPosition: jest.fn()
};

Object.defineProperty(global, "navigator", { value: {geolocation: geolocation}, writable: true });

const watchPosition = jest.spyOn(global.navigator.geolocation, 'watchPosition');
const clearWatch = jest.spyOn(global.navigator.geolocation, 'clearWatch');
const getPosition = jest.spyOn(global.navigator.geolocation, 'getCurrentPosition');

test.only('Get coordinates ', async () => {
	getPosition.mockImplementation(s => {
		s({coords: {} as Coordinates});
	});
	await GeolocationService.getCoordinates(false).then(async _ => {
		expect(watchPosition.mock.calls.length).toBe(0);
		await GeolocationService.getCoordinates(true).then(_ => expect(watchPosition.mock.calls.length).toBe(1));
	});
	expect.assertions(2);
});

test('Start watching', () => {
	GeolocationService.startWatchingGeoloc();
	expect(watchPosition.mock.calls.length).toBe(1);
	GeolocationService.startWatchingGeoloc();
	expect(watchPosition.mock.calls.length).toBe(1);
});

test('Stop watching', () => {
	GeolocationService.startWatchingGeoloc();
	GeolocationService.stopWatchingGeoloc();
	expect(clearWatch.mock.calls.length).toBe(1);
	GeolocationService.stopWatchingGeoloc();
	expect(clearWatch.mock.calls.length).toBe(1);
});
