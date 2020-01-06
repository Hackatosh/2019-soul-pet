import { AuthenticationService } from '../services';
import { config } from '../config';

/**
 * A class designed to handle HTTP calls (`GET`, `POST`, `PUT` and `DELETE`)
 */
export class httpClient {
    /**
     * Generates headers for an HTTP request.
     * @param authenticated Indicates whether the request should be authenticated or not.
     * @param body Indicates whether the request has a body or not.
     * @returns The generated headers
     */
    private static headers(authenticated: boolean, body: boolean): Headers {
        const headers = new Headers();
        if (authenticated && AuthenticationService.isLoggedIn && AuthenticationService.User.token)
            headers.append('Authorization', `JWT ${AuthenticationService.User.token}`);
        if (body)
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
    private static options(authenticated: boolean, method: string, body = ''): RequestInit {
        const hasBody = method !== 'GET' && body !== '';
        const requestOptions: RequestInit = {
            method: method,
            headers: this.headers(authenticated, hasBody),
            mode: 'cors',
            credentials: 'include'
        };
        if (hasBody) {
            requestOptions.body = body;
        }
        return requestOptions;
    }

    /**
     * Handles an HTTP response depending on its status.
     * @param response the Response to handle
     * @returns A Promise containing the parsed JSON of the body or null if no body is provided
     */
    private static async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            return response.json().then(({message}) => Promise.reject(message), () => Promise.reject(response.statusText));
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
    public static async post<T>(endpoint: string, body: T, authenticated = false): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'POST', JSON.stringify(body)));
    }

    /**
     * Sends a HTTP PUT request.
     * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
     * @param body The body, of type T, of the request
     * @param authenticated Indicates whether the request should be authenticated.
     * @returns A promise containing an object of type T
     */
    public static async put<T>(endpoint: string, body: T, authenticated = false): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'PUT', JSON.stringify(body)));
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
