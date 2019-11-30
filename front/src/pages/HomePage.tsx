import React from 'react';
import { authenticationService } from '../services';
import { User } from '../models';

class HomePage extends React.Component<{}, { currentUser: User }> {
	constructor(props: Readonly<{}>) {
		super(props);
		
		this.state = {
			currentUser: authenticationService.currentUserValue
		};
	}

	render() {
		const { currentUser } = this.state;
		return (
			<div>
                <h1>Hi {currentUser.username}!</h1>
                <p>You’re logged in with React and JWT!</p>
                <h3>Users from secure api end point:</h3>
            </div>
		);
	}
}

export { HomePage };