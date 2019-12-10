import { authenticationService } from '../services';
import { handleResponse } from './handle-response';
import { config } from '../config';

/**
 * A class designed to handle HTTP calls (`GET`, `POST`, `PUT` and `DELETE`)
 */
export class http {
    /**
     * Generates headers for an HTTP request.
     * @param authenticated Indicates whether the request should be authenticated or not.
     * @param body Indicates whether the request has a body or not.
     * @returns The generated headers
     */
    private static headers(authenticated: boolean, body: boolean): Headers {
        const headers = new Headers();
        if (authenticated && authenticationService.currentUserValue && authenticationService.currentUserValue.token) {
            headers.append('Authorization', 'JWT ' + authenticationService.currentUserValue.token);
        }
        if (body) {
            headers.append('Content-Type', 'application/json');
        }
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
     * Performs an HTTP request.
     * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
     * @param requestOptions A RequestInit object to configure the request
     * @returns A promise containing an object of type T
     */
    private static async request<T>(endpoint: string, requestOptions: RequestInit): Promise<T> {
        return fetch(config.apiUrl + endpoint, requestOptions).then(handleResponse).then(data => {
            return data as T;
        }).catch(message => {
            return Promise.reject(message);
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
     * @param authenticated Indicates whether the request should be authenticated.
     * @param body Contains the body of the request, as a string, if need be.
     * @returns A promise containing an object of type T
     */
    public static async post<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'POST', body));
    }

    /**
     * Sends a HTTP PUT request.
     * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
     * @param authenticated Indicates whether the request should be authenticated.
     * @param body Contains the body of the request, as a string, if need be.
     * @returns A promise containing an object of type T
     */
    public static async put<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'PUT', body));
    }

    /**
     * Sends a HTTP DELETE request.
     * @param endpoint The endpoint to send the request to, as a *non-absolute* URL
     * @param authenticated Indicates whether the request should be authenticated.
     * @param body Contains the body of the request, as a string, if need be.
     * @returns A promise containing an object of type T
     */
    public static async delete<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'DELETE', body));
    }
}
