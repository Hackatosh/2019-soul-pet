import { authenticationService } from '../services';
import { handleResponse } from './handle-response';
import { config } from '../config';

export class http {
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

    private static async request<T>(endpoint: string, requestOptions: RequestInit): Promise<T> {
        return fetch(config.apiUrl + endpoint, requestOptions).then(handleResponse).then(data => {
            return data as T;
        }).catch(message => {
            return Promise.reject(message);
        });
    }

    public static async get<T>(endpoint: string, authenticated = false): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'GET'));
    }

    public static async post<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'POST', body));
    }

    public static async put<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'PUT', body));
    }

    public static async delete<T>(endpoint: string, authenticated = false, body = ''): Promise<T> {
        return await this.request<T>(endpoint, this.options(authenticated, 'DELETE', body));
    }
}
