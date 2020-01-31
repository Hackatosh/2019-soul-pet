import { history, httpClient } from '../helpers';
import { User } from '../models';
import { BehaviorSubject } from 'rxjs';

/**
 * Class designed to handle authentication with the back API
 */
export class AuthenticationService {
	private static user: BehaviorSubject<User> = new BehaviorSubject({} as User);

	static UserObservable = AuthenticationService.user.asObservable();

	/**
	 * Attempts to log the user in, then redirects to the home page.
	 * Params are self-explanatory
	 * @returns The user as sent by the API
	 */
	static async login(email: string, password: string): Promise<User> {
		return httpClient.post<User>('/auth/login', { id: 0, email: email, password: password }).then(user => {
			localStorage.setItem('user', JSON.stringify(user));
			AuthenticationService.user.next(user);
			history.push('/');
			return user;
		}, () => {
			AuthenticationService.user.next({} as User);
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
		AuthenticationService.user.next({} as User)
		history.push('/login');
	}

	/**
	 * Retrieves the logged-in user.
	 * Beware, if the user is not logged in, all properties are undefined.
	 * @returns a `User` object, with possibly undefined properties
	 */
	static get User(): User {
		return AuthenticationService.user.value;
	}

	static get isLoggedIn(): boolean {
		return AuthenticationService.user.value.id !== undefined;
	}

	/**
	 * Attempts to restore the user from the local storage.
	 * This should only be called once, in App.tsx for example.
	 */
	static restoreUser(): void {
		const user = localStorage.getItem('user');
		if (user === null)
			AuthenticationService.user.next({} as User);
		else
			AuthenticationService.user.next(JSON.parse(user) as User);
	}

	/**
	 * Retrieves the profile of a user.
	 * @param id the ID of the user to retrieve
	 * @returns the user
	 */
	static async getProfile(id: number): Promise<User> {
		return httpClient.get<User>(`/accounts/${id}`, true).catch(() => Promise.reject('Erreur lors de la récupération du profil'));
	}
}
