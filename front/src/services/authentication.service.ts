import { history, httpClient } from '../helpers';
import { User } from '../models';

/**
 * Class designed to handle authentication with the back API
 */
export class AuthenticationService {
    private static user: User;

    /**
     * Attempts to log the user in, then redirects to the home page.
     * Params are self-explanatory
     * @returns The user as sent by the API
     */
    static async login(email: string, password: string): Promise<User> {
        return httpClient.post<User>('/auth/login', { id: 0, email: email, password: password }).then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            history.push('/');
            AuthenticationService.user = user;
            return user;
        }, () => {
            return Promise.reject('Identifiants incorrects');
        });
    }

    /**
     * Attempts to register a new user.
     * Params are self-explanatory.
     * @returns The user as registered by the API
     */
    static async register(username: string, email: string, password: string): Promise<User> {
        return httpClient.post<User>('/auth/register', { id: 0, username: username, email: email, password: password }).then(null, () => Promise.reject('Création du compte impossible ; veuillez réessayer.'));
    }
    
    /**
     * Logs the user out, and redirects to the login page.
     */
    static logout(): void {
        localStorage.removeItem('user');
        history.push('/login');
        AuthenticationService.user = {} as User;
    }

    /**
     * Checks whether the user is logged in or not.
     * @returns true if the user is logged in
     */
    static get isLoggedIn(): boolean {
        return localStorage.getItem('user') !== null;
    }

    /**
     * Retrieves the logged-in user.
     * Beware, if the user is not logged in, all properties are undefined.
     * @returns a `User` object, with possibly undefined properties
     */
    static get User(): User {
        if (AuthenticationService.user === undefined && AuthenticationService.isLoggedIn)
            AuthenticationService.user = JSON.parse(localStorage.getItem('user') as string) as User;
        return AuthenticationService.user;
    }
}
