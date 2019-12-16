import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar } from './components';
import { HomePage, LoginPage, RegisterPage } from './pages';
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
				</Switch>
            </Router>
        );
    }
}

export { App };
