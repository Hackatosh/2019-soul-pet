import { BehaviorSubject } from 'rxjs';
import { config } from '../config';
import { handleResponse } from '../helpers';
import { User } from '../models';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser') as string) as User);

export const authenticationService = {
	login,
	logout,
	currentUser: currentUserSubject.asObservable(),
	get currentUserValue () { return currentUserSubject.value }
};

async function login(email: string, password: string) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ email, password })
	};
	console.log(`${config.apiUrl}/auth/login`);
	return fetch(`${config.apiUrl}/auth/login`, requestOptions).then(handleResponse).then((user: User) => {
		localStorage.setItem('currentUser', JSON.stringify(user));
		currentUserSubject.next(user);
		return user;
	});
}

function logout() {
	localStorage.removeItem('currentUser');
	currentUserSubject.next(User.noUser);
}
