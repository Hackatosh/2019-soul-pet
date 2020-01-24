import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthenticationService } from '../services';

export const PrivateRoute = ({ component: Component, ...rest } : any) => (
	<Route {...rest} render={props => {
		if (!AuthenticationService.isLoggedIn) {
			return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
		}
		return <Component {...props} />
	}} />
);
