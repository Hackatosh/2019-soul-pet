import React from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../services';
import { history } from '../helpers';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavBar extends React.Component {
	private logout() {
		authenticationService.logout();
		history.push('/login');
    }

	render() {
		return (
			<Navbar expand="lg" bg="dark" variant="dark" fixed="top">
				<Navbar.Toggle aria-controls="navbar" />
				<Link to="/" className="navbar-brand">SoulPet</Link>
				<Navbar.Collapse id="navbar">
					{authenticationService.isLoggedIn &&
						<Nav>
							<Link to="/" className="nav-link">Mes animaux</Link>
							<Link to="/services" className="nav-link">Services</Link>
							<Link to="/events/list" className="nav-link">Événements</Link>
						</Nav>
					}
					<form className="form-inline ml-auto">
						{
							authenticationService.isLoggedIn
							? (<button className="btn btn-danger" type="button" onClick={this.logout}>Déconnexion</button>)
							: (<Link className="btn btn-success" to="/login">Connexion</Link>)
						}
					</form>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export { NavBar };
