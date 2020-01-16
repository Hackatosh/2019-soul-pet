import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar } from './components';
import { HomePage, LoginPage, RegisterPage, EventList, EventDetails, ServicesPage } from './pages';
import { history } from './helpers';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router history={history}>
				<NavBar />
				<Switch>
					<PrivateRoute exact path="/" component={HomePage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
          <Route path="/events/list" component={EventList} />
          <Route path="/events/:id" component={EventDetails} />
          <PrivateRoute path="/services" component={ServicesPage} />
				</Switch>
            </Router>
        );
    }
}

export { App };
