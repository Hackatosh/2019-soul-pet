import React from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../services';
import { history } from '../helpers';

class NavBar extends React.Component {
	private logout() {
		authenticationService.logout();
		history.push('/login');
    }
    
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
				<Link to="/" className="navbar-brand">SoulPet</Link>
				<div className="collapse navbar-collapse" id="navbar">
					{authenticationService.isLoggedIn &&
						<ul className="navbar-nav">
							<li className="nav-item"><Link to="/" className="nav-link">Mes animaux</Link></li>
							<li className="nav-item"><Link to="/services" className="nav-link">Services</Link></li>
							<li className="nav-item"><Link to="/events" className="nav-link">Événements</Link></li>
						</ul>
					}
					<form className="form-inline ml-auto">
						{
							authenticationService.isLoggedIn 
							? (<button className="btn btn-danger" type="button" onClick={this.logout}>Déconnexion</button>)
							: (<Link className="btn btn-success" to="/login">Connexion</Link>)
						}
					</form>
				</div>
			</nav>
		);
	}
}

export { NavBar };