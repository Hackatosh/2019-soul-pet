import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { authenticationService } from './services';
import { PrivateRoute } from './components';
import { HomePage, LoginPage, RegisterPage } from './pages';
import { NavBar } from './components/NavBar';
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
				</Switch>
            </Router>
        );
    }
}

export { App };
