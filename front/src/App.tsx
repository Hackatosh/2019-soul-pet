import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar } from './components';
import { HomePage, LoginPage, RegisterPage, EventsSearchPage, EventPage, ServicesPage, AnimalPage, NotFoundPage } from './pages';
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

					<PrivateRoute path="/events/list" component={EventsSearchPage} />
					<PrivateRoute path="/events/:id" component={EventPage} />
					<PrivateRoute path="/services" component={ServicesPage} />
					<PrivateRoute exact path="/" component={HomePage} />
					<PrivateRoute exact path="/animal/:id" component={AnimalPage} />
					<Route path="*" component={NotFoundPage} />
				</Switch>
            </Router>
        );
    }
}

export { App };
