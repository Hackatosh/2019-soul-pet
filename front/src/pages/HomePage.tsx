import React from 'react';
import { AuthenticationService, AnimalService } from '../services';
import { RouteComponentProps } from 'react-router';
import { Button } from 'react-bootstrap';
import './HomePage.css';
import { AnimalCard, AnimalForm } from '../components';
import { Animal } from '../models';
import { history } from '../helpers';

export interface HomePageState {
	error: string;
	animals: Animal[];
	showAnimalForm: boolean;
}

export class HomePage extends React.Component<RouteComponentProps, HomePageState> {
	constructor(props: RouteComponentProps) {
		super(props);

		this.state = { animals: [], showAnimalForm: false, error: '' };
	}

	componentDidMount() {
		AnimalService.getAll(AuthenticationService.User.id).then((animals: Animal[]) => this.setState({ animals: animals.reverse() })).catch(() => this.setState({ error: 'Erreur lors de la récupération des animaux' }));      
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
				<div className="row row-cols-1 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<p className="text-center"><Button variant="success" onClick={() => this.showAnimalForm(true)}>Ajouter un animal</Button></p>
					</div>
				</div>
				{this.state.animals.length === 0 && 
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">Vous n’avez pas encore d’animaux…</div></div>
				</div>}
				<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center">
					{this.state.animals.map(a => <div className="col mb-4" key={a.id}><AnimalCard animal={a} /></div>)}
				</div>
                <AnimalForm show={this.state.showAnimalForm} onHide={() => this.showAnimalForm(false)} onSuccess={(animal: Animal) => history.push(`animal/${animal.id}`) } />
            </div>
		);
	}
}
