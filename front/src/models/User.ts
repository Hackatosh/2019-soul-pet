class User {
	id: number;
	username: string;
	email: string;
	token: string;

	static noUser = new User(-1, '', '', ''); 

	constructor(id: number, username: string, email: string, token: string) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.token = token;
	}
}

export { User };