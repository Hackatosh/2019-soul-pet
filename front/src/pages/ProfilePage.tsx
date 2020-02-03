import React from 'react';
import { AuthenticationService, AnimalService } from '../services';
import { RouteComponentProps } from 'react-router';
import { Button } from 'react-bootstrap';
import './HomePage.css';
import { AnimalCard, AnimalForm } from '../components';
import { Animal, User } from '../models';
import { history } from '../helpers';

export interface ProfilePageProps extends RouteComponentProps<{id?: string}> {}

export interface ProfilePageState {
	error: string;
	animals: Animal[];
	showAnimalForm: boolean;
	id: number;
	canModify: boolean;
	user: User;
}

/**
 * Page which displays some information about a user such as their username and their pets.
 * The page can be seen is proprietary mode, which allows edition, and in visitor mode.
 */
export class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
	constructor(props: ProfilePageProps) {
		super(props);

		let id = 0;
		let canModify = false;

		if (this.props.match.params.id !== undefined && isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else if (this.props.match.params.id === undefined) {
			id = AuthenticationService.User.id;
			canModify = true;
		} else
			id = parseInt(this.props.match.params.id);
		this.state = { id: id, canModify: canModify, animals: [], showAnimalForm: false, error: '', user: {} as User };
	}

	componentDidMount() {
		AuthenticationService.getProfile(this.state.id).then(u => this.setState({ user: u })).catch(() => this.setState({ error: 'Erreur lors de la récupération du profil' }));
		AnimalService.getAll(this.state.id).then((animals: Animal[]) => this.setState({ animals: animals.reverse() })).catch(() => this.setState({ error: 'Erreur lors de la récupération des animaux' }));
	}

	private showAnimalForm(state: boolean) {
		this.setState({ showAnimalForm: state });
	}

	render() {
		return (
			<div className="container">
				{this.state.error !== '' &&
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3"><div className="alert alert-danger">{this.state.error}</div></div>
				</div>}
				{this.state.canModify &&
				<div className="row row-cols-1 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<p className="text-center"><Button variant="success" onClick={() => this.showAnimalForm(true)}>Ajouter un animal</Button></p>
					</div>
				</div>}
				{!this.state.canModify && this.state.user.username !== undefined &&
				<div className="row row-cols-1 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<h1 className="display-5 text-center">{this.state.user.username}</h1>
					</div>
				</div>}
				{this.state.id === AuthenticationService.User.id && !this.state.canModify &&
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<div className="alert alert-info">
							<p className="mb-1">Vous visualisez actuellement votre profil en tant que visiteur.</p>
							<p className="text-right mb-0"><button className="btn btn-secondary btn-sm" onClick={() => this.setState({ canModify: true})}>Retour au mode normal</button></p>
						</div>
					</div>
				</div>}
				{this.state.animals.length === 0 &&
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">{this.state.canModify ? 'Vous n’avez ' : 'Cette personne n’a '} pas encore d’animaux…</div></div>
				</div>}
				<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center">
					{this.state.animals.map(a => <div className="col mb-4" key={a.id}><AnimalCard animal={a} /></div>)}
				</div>
                {this.state.canModify &&
				<AnimalForm show={this.state.showAnimalForm} onHide={() => this.showAnimalForm(false)} onSuccess={(animal: Animal) => history.push(`animal/${animal.id}`) } />}
            </div>
		);
	}
}
