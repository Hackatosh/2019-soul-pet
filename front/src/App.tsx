import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar } from './components';
import { ProfilePage, LoginPage, RegisterPage, EventsSearchPage, EventPage, ServicesPage, AnimalPage, NotFoundPage } from './pages';
import { history } from './helpers';
import { AuthenticationService } from './services';

class App extends React.Component {
	constructor(props: Readonly<{}>) {
		super(props);
		AuthenticationService.restoreUser();
	}

    render() {
        return (
            <Router history={history}>
				<NavBar />
				<Switch>
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
					
					<PrivateRoute exact path="/events/list" component={EventsSearchPage} />
					<PrivateRoute exact path="/events/:id" component={EventPage} />
					<PrivateRoute path="/services" component={ServicesPage} />
					<PrivateRoute exact path="/" component={ProfilePage} />
					<PrivateRoute exact path="/animal/:id" component={AnimalPage} />
					<PrivateRoute exact path="/profile/:id" component={ProfilePage} />
					<Route path="*" component={NotFoundPage} />
				</Switch>
            </Router>
        );
    }
}

export { App };
