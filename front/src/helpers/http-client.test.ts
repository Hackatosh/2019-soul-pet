import { httpClient } from "./http-client";
import { User } from "../models";
import { AuthenticationService } from "../services";

const fetch = jest.spyOn(global, 'fetch');
const isLoggedIn = jest.spyOn(AuthenticationService, 'isLoggedIn', 'get');

const user: User = {
	id: 1,
	username: 'testuser',
	email: 'testuser@test.ts',
	token: 'aaaa'
};

beforeEach(() => {
	jest.resetAllMocks();
});

test('HTTP GET Success', async () => {
	fetch.mockResolvedValueOnce<Response>({
		ok: true,
		status: 200,
		headers: new Headers(),
		json: () => Promise.resolve(user)
	});
	await httpClient.get<User>('account/', false).then(u => expect(u).toBe(user));
});

test('HTTP authenticated GET', async () => {
	fetch.mockResolvedValueOnce<Response>({
		ok: true,
		status: 200,
		headers: new Headers(),
		json: () => Promise.resolve(user)
	});
	isLoggedIn.mockReturnValueOnce(true).mockReturnValueOnce(false);
	jest.spyOn(AuthenticationService, "User", "get").mockReturnValue(user);
	// isLoggedIn will return true.
	await httpClient.get<User>('account/', true).then(u => {
		let requestOptions: RequestInit = fetch.mock.calls[0][1];
		expect(requestOptions).toHaveProperty('headers');
		expect((requestOptions.headers as Headers).get('Authorization')).toBe(`JWT ${user.token}`);
		expect(u).toBe(user);
	})
	// isLoggedIn will return false.
	await httpClient.get<User>('account/', true).catch(() => {
		expect(isLoggedIn.mock.calls).toHaveLength(2);
		expect(fetch.mock.calls).toHaveLength(1);
	});
	expect.assertions(5);
});

test('HTTP GET Status Error', async () => {
	fetch.mockResolvedValueOnce<Response>({
		ok: false,
		status: 404,
		statusText: 'User not found',
		json: () => Promise.reject()
	});
	await httpClient.get<User>('account/', false).catch(e => expect(e).toBe('User not found'));
	expect.assertions(1);
});

test('HTTP GET User-friendly Error', async () => {
	const body = { message: 'This user does not exist'};
	fetch.mockResolvedValueOnce<Response>({
		ok: false,
		status: 404,
		statusText: 'User not found',
		json: () => Promise.resolve(body)
	});
	await httpClient.get<User>('account/').catch(e => expect(e).toBe(body.message));
	expect.assertions(1);
});

test('HTTP GET Network error', async () => {
	const error = new ErrorEvent('NetworkError', { message: 'Could not reach host' });
	fetch.mockRejectedValueOnce(error);
	await httpClient.get<User>('account/', false).catch(e => expect(e).toBe(error.message));
	expect.assertions(1);
});

test('HTTP POST Success', async () => {
	fetch.mockResolvedValueOnce<Response>({
		ok: true,
		status: 201,
		headers: new Headers(),
		json: () => Promise.resolve(user)
	});
	await httpClient.post<User>('account/', user).then(u => {
		expect((fetch.mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(user));
		expect(((fetch.mock.calls[0][1] as RequestInit).headers as Headers).get('Content-Type')).toBe('application/json');
		expect(u).toBe(user);
	});
});

test('HTTP PUT Success', async () => {
	fetch.mockResolvedValueOnce<Response>({
		ok: true,
		status: 200,
		headers: new Headers(),
		json: () => Promise.resolve(user)
	});
	await httpClient.put<User>('account/', user).then(u => {
		expect((fetch.mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(user));
		expect(((fetch.mock.calls[0][1] as RequestInit).headers as Headers).get('Content-Type')).toBe('application/json');
		expect(u).toBe(user);
	});
});

test('HTTP DELETE Success', async () => {
	fetch.mockResolvedValueOnce<Response>(new Response(null, { status: 200 }));
	await httpClient.delete('account/').then(u => {
		expect(u).toBeNull();
		expect(((fetch.mock.calls[0][1] as RequestInit).headers as Headers).get('Content-Type')).toBeNull();
	});
});

test('HTTP DELETE Status error', async () => {
	fetch.mockResolvedValueOnce<Response>(new Response(null, { status: 404, statusText: 'User not found' }));
	await httpClient.delete('account/').catch(error => {
		expect(((fetch.mock.calls[0][1] as RequestInit).headers as Headers).get('Content-Type')).toBeNull();
		expect(error).toBe('User not found');
	});
	expect.assertions(2);
});
