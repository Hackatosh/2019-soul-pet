import React from 'react';
import { AnimalService } from '../services';
import { RouteComponentProps } from 'react-router';
import './HomePage.css';
import { AnimalForm, DeleteConfirmation } from '../components';
import { Animal, Specie } from '../models';
import { Card, Button } from 'react-bootstrap';
import { history } from '../helpers';
import sheep from '../resources/animals/sheep.jpg';

export interface AnimalPageProps extends RouteComponentProps<{id: string}> {}

export interface AnimalPageState {
    animal: Animal | undefined;
	showAnimalForm: boolean;
	showAnimalDelete: boolean;
}

export class AnimalPage extends React.Component<AnimalPageProps, AnimalPageState> {
	private error = '';
	private id = 0;
	private age = 0;
	private specie = '';
	private species: Specie[] = [];

    constructor(props: AnimalPageProps) {
		super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else
			this.id = parseInt(this.props.match.params.id);
        this.state = { animal: undefined, showAnimalForm: false, showAnimalDelete: false };
	}

    componentDidMount() {
        AnimalService.getSpecies().then(species => {
			this.species = species;
            AnimalService.get(this.id).then(a => this.prepareAnimal(a)).catch(() => history.push('/404')) ;
        }).catch(() => {
            this.error = 'Erreur lors de la récupération des espèces';
            this.setState({});
        });    
	}
	
	private prepareAnimal(animal: Animal) {
		animal.specie = this.species.find(s => s.id === animal.specieId);
		this.age = Math.floor(((new Date()).getTime() - animal.birthdate.getTime()) / 31536000000);
		this.specie = animal.specie !== undefined ? animal.specie.name[0].toUpperCase() + animal.specie.name.substr(1) : '';
		this.setState({ animal: animal })
	}

    private showAnimalForm(state: boolean) {
        this.setState({ showAnimalForm: state });
	}
	
	private showAnimalDelete(state: boolean) {
        this.setState({ showAnimalDelete: state });
    }

    render() {
		return (
			<div className="container">
				{this.state.animal !== undefined && 
                <React.Fragment>
					<div className="row">
						<div className="col-10 offset-1 col-md-3">
							<img className="rounded img-fluid" src={sheep} alt={"Picture of " + this.state.animal.name} />
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							{this.error !== '' && <div className="alert alert-danger">{this.error}</div>}
							<h1 className="display-3">{this.state.animal.name}</h1>
							<p className="lead text-muted">{this.specie} né le {this.state.animal.birthdate.toLocaleDateString()} ({this.age} ans) &middot; <Button variant="primary" onClick={() => this.showAnimalForm(true)}>Éditer</Button> &middot; <Button variant="danger" onClick={() => this.showAnimalDelete(true)}>Supprimer</Button></p>
							<h2>Services préférés</h2>
							<div className="row row-cols-1 row-cols-md-3">
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Dark Vador</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Vétérinaire</Card.Subtitle>
											<Card.Text>Spécialisé pour nos amis canins.<br/>Fermé le lundi</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Kristoff</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Vétérinaire</Card.Subtitle>
											<Card.Text>J’aime les rennes.<br/>Fermé l’hiver</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Yennefer</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Toiletteuse</Card.Subtitle>
											<Card.Text>J’ai pas encore regardé mais ça ne saurait tarder.</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
							</div>
							<h2>Événements</h2>
							<div className="row row-cols-1 row-cols-md-3">
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Dark Vador</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Vétérinaire</Card.Subtitle>
											<Card.Text>Spécialisé pour nos amis canins.<br/>Fermé le lundi</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Kristoff</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Vétérinaire</Card.Subtitle>
											<Card.Text>J’aime les rennes.<br/>Fermé l’hiver</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
								<div className="col mb-4">
									<Card>
										<Card.Body>
											<Card.Title>Yennefer</Card.Title>
											<Card.Subtitle className="mb-2 text-muted">Toiletteuse</Card.Subtitle>
											<Card.Text>J’ai pas encore regardé mais ça ne saurait tarder.</Card.Text>
											<Card.Link href="#">Voir la fiche</Card.Link>
										</Card.Body>
									</Card>
								</div>
							</div>
						</div>
					</div>
					<AnimalForm show={this.state.showAnimalForm} animal={this.state.animal} onHide={() => this.showAnimalForm(false)} onSuccess={a => this.prepareAnimal(a)} />
					<DeleteConfirmation prompt='Écrivez le nom de l’animal pour confirmer la suppression' expected={this.state.animal?.name} show={this.state.showAnimalDelete} onHide={() => this.showAnimalDelete(false)} onSuccess={() => {
						AnimalService.delete(this.id).then(() => history.push('/')).catch(() => {
							this.error = 'Erreur lors de la suppression';
							this.setState({});
						})
					}} />
				</React.Fragment>}
            </div>
		);
	}
}
