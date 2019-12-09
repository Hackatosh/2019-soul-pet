import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { authenticationService } from './services';
import { PrivateRoute, NavBar } from './components';
import { HomePage, LoginPage, RegisterPage, ServicesPage } from './pages';
import { history } from './helpers';

class App extends React.Component<{}, { currentUser: any }> {
    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    render() {
        return (
            <Router history={history}>
				<NavBar />
				<Switch>
					<PrivateRoute exact path="/" component={HomePage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
          <PrivateRoute path="/services" component={ServicesPage} />
				</Switch>
            </Router>
        );
    }
}

export { App };
