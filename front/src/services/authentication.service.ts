import { BehaviorSubject } from 'rxjs';
import { history, http } from '../helpers';
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
	return http.post<User>('/auth/login', false, JSON.stringify({ email, password })).then((user: User) => {
		localStorage.setItem('currentUser', JSON.stringify(user));
		currentUserSubject.next(user);
		history.push('/');
		return user;
	}, () => {
		return Promise.reject('Identifiants incorrects');
	});
}

async function register(username: string, email: string, password: string) {
	return http.post('/auth/register', false, JSON.stringify({ username, email, password })).then(null, () => Promise.reject('Création du compte impossible ; veuillez réessayer.'));
}

function logout() {
	localStorage.removeItem('currentUser');
	currentUserSubject.next(User.noUser);
}
