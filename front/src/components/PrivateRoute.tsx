import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthenticationService } from '../services';

/**
 * This component is used as a wrapper for the routes that need to be authenticated.
 * The component is rendered only if the user has been previously authenticated, else it redirects him to the login page.
 */
export const PrivateRoute = ({ component: Component, ...rest } : any) => (
	<Route {...rest} render={props => {
		if (!AuthenticationService.isLoggedIn) {
			return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
		}
		return <Component {...props} />
	}} />
);
