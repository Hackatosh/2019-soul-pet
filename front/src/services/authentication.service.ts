import { BehaviorSubject } from 'rxjs';
import { config } from '../config';
import { handleResponse } from '../helpers';
import { User } from '../models';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser') as string) as User);

export const authenticationService = {
	login,
	register,
	logout,
	currentUser: currentUserSubject.asObservable(),
	get currentUserValue () { return currentUserSubject.value },
	get isLoggedIn () { return this.currentUserValue && this.currentUserValue.id !== -1 }
};

async function login(email: string, password: string) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ email, password })
	};
	return fetch(`${config.apiUrl}/auth/login`, requestOptions).then(handleResponse).then((user: User) => {
		localStorage.setItem('currentUser', JSON.stringify(user));
		currentUserSubject.next(user);
		return user;
	}, () => {
		return Promise.reject('Identifiants incorrects');
	});
}

async function register(username: string, email: string, password: string) {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({ username, email, password })
	};
	return fetch(`${config.apiUrl}/auth/register`, requestOptions).then(handleResponse).then( () => {
		return Promise.reject('Veuillez vérifier vos informations');
	});
}

function logout() {
	localStorage.removeItem('currentUser');
	currentUserSubject.next(User.noUser);
}
