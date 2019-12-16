import React from 'react';
import { Link } from 'react-router-dom';
import { AuthenticationService } from '../services';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export class NavBar extends React.Component {
	render() {
		return (
			<Navbar expand="lg" bg="dark" variant="dark" fixed="top">
				<Navbar.Toggle aria-controls="navbar" />
				<Link to="/" className="navbar-brand">SoulPet</Link>
				<Navbar.Collapse id="navbar">
					{AuthenticationService.isLoggedIn &&
						<Nav>
							<Link to="/" className="nav-link">Mes animaux</Link>
							<Link to="/services" className="nav-link">Services</Link>
							<Link to="/events/list" className="nav-link">Événements</Link>
						</Nav>
					}
					<form className="form-inline ml-auto">
						{
							AuthenticationService.isLoggedIn 
							? (<button className="btn btn-danger" type="button" onClick={AuthenticationService.logout}>Déconnexion</button>)
							: (<Link className="btn btn-success" to="/login">Connexion</Link>)
						}
					</form>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
