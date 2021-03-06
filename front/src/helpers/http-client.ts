import { AuthenticationService } from '../services';
import { config } from '../config';

/**
 * A class designed to handle HTTP calls (`GET`, `POST`, `PUT` and `DELETE`)
 */
export class httpClient {
	/**
	 * Generates headers for an HTTP request.
	 * @param authenticated Indicates whether the request should be authenticated or not.
	 * @param json Indicates whether the request contains a JSON object or not.
	 * @returns The generated headers
	 */
	private static headers(authenticated: boolean, json: boolean): Headers {
		const headers = new Headers();
		if (authenticated && AuthenticationService.isLoggedIn && AuthenticationService.User.token)
			headers.append('Authorization', `JWT ${AuthenticationService.User.token}`);
		else if (authenticated)
			throw new Error('User is not authenticated');
		if (json)
			headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		return headers;
	}

	/**
	 * Generates request options for an HTTP request.
	 * @param authenticated Indicates whether the request should be authenticated or not.
	 * @param method Indicates the HTTP method to be used.
	 * @param body Contains the body of the request, if need be.
	 * @returns The generated RequestInit object
	 */
	private static options(authenticated: boolean, method: string, body: string | FormData = ''): RequestInit {
		const getOrDelete = method === 'GET' || method === 'DELETE';
		const requestOptions: RequestInit = {
			method: method,
			headers: this.headers(authenticated, !getOrDelete && !(body instanceof FormData)),
			mode: 'cors',
			credentials: 'include'
		};
		if (!getOrDelete && body !== '')
			requestOptions.body = body;
		return requestOptions;
	}

	/**
	 * Handles an HTTP response depending on its status.
	 * @param response the Response to handle
	 * @returns A Promise containing the parsed JSON of the body, or a blob if the
	 * response is an image
	 */
	private static async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			return response.json().then(({message}) => Promise.reject(message), () => Promise.reject(response.statusText));
		}
		if (response.headers.get('Content-Type') !== null && response.headers.get('Content-Type')?.match(/image\/(?:gif|jpeg|png)/)) {
			return response.blob().catch(() => response.json());
		}
		return response.json().catch(() => null);
	}

	/**
	 * Performs an HTTP request.
	 * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
	 * @param requestOptions A RequestInit object to configure the request
	 * @returns A promise containing an object of type T
	 */
	private static async request<T>(endpoint: string, requestOptions: RequestInit): Promise<T> {
		return fetch(config.apiUrl + endpoint, requestOptions).then(httpClient.handleResponse).catch(error => {
			if (error instanceof ErrorEvent)
				return Promise.reject(error.message);
			return Promise.reject(error);
		}).then(data => {
			return data as T;
		});
	}

	/**
	 * Sends a HTTP GET request.
	 * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
	 * @param authenticated Indicates whether the request should be authenticated.
	 * @returns A promise containing an object of type T
	 */
	public static async get<T>(endpoint: string, authenticated = false): Promise<T> {
		return await this.request<T>(endpoint, this.options(authenticated, 'GET'));
	}

	/**
	 * Sends a HTTP POST request.
	 * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
	 * @param body The body, of type T, of the request
	 * @param authenticated Indicates whether the request should be authenticated.
	 * @returns A promise containing an object of type T
	 */
	public static async post<T>(endpoint: string, body: T | FormData, authenticated = false): Promise<T> {
		// If the body is a form, then we must send it as-is.
		return await this.request<T>(endpoint, this.options(authenticated, 'POST', body instanceof FormData ? body as FormData : JSON.stringify(body)));
	}

	/**
	 * Sends a HTTP PUT request.
	 * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
	 * @param body The body, of type T, of the request
	 * @param authenticated Indicates whether the request should be authenticated.
	 * @returns A promise containing an object of type T, with updated properties
	 */
	public static async put<T>(endpoint: string, body: T, authenticated = false): Promise<T> {
		return this.request<T>(endpoint, this.options(authenticated, 'PUT', JSON.stringify(body))).then(o => {
			return Object.defineProperties(body, Object.getOwnPropertyDescriptors(o));
		});
	}

	/**
	 * Sends a HTTP DELETE request.
	 * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
	 * @param authenticated Indicates whether the request should be authenticated.
	 * @returns A promise containing null
	 */
	public static async delete(endpoint: string, authenticated = false): Promise<null> {
		return await this.request<null>(endpoint, this.options(authenticated, 'DELETE'));
	}
}
