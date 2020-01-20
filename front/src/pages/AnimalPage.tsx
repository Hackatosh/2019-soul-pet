import React from 'react';
import { AnimalService, PictureService } from '../services';
import { RouteComponentProps } from 'react-router';
import './HomePage.css';
import { AnimalForm, DeleteConfirmation, SquareImage } from '../components';
import { Animal, Picture } from '../models';
import { Card, Button } from 'react-bootstrap';
import { history, titleCase, ageFromDate } from '../helpers';

export interface AnimalPageProps extends RouteComponentProps<{id: string}> {}

export interface AnimalPageState {
    error: string;
    id: number;
    animal: Animal | undefined;
    pictures: string[];
	showAnimalForm: boolean;
    showAnimalDelete: boolean;
}

export class AnimalPage extends React.Component<AnimalPageProps, AnimalPageState> {
	constructor(props: AnimalPageProps) {
		super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else
            this.state = { error: '', id: parseInt(this.props.match.params.id), animal: undefined, pictures: [], showAnimalForm: false, showAnimalDelete: false };
	}

    componentDidMount() {
        AnimalService.get(this.state.id).then(a => {
            this.setState({ animal: a });
            if (a.animalPictures !== undefined && a.animalPictures.length > 0) {
                let pictures = new Array<string>(a.animalPictures.length).fill('');
                this.setState({ pictures: pictures });
                a.animalPictures.forEach((p: Picture, i: number) => PictureService.getPicture('animals', p.filename).then(c => {
                    pictures[i] = c;
                    this.setState({ pictures: pictures });
                }));
            }
        }).catch(() => history.push('/404'));   
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
                            <SquareImage image={this.state.pictures[this.state.pictures.length - 1]}/>
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							{this.state.error !== '' && <div className="alert alert-danger">{this.state.error}</div>}
							<h1 className="display-3">{this.state.animal.name}</h1>
							<p className="lead text-muted">{this.state.animal.specie !== undefined ? titleCase(this.state.animal.specie?.name) : ''} né le {this.state.animal.birthdate.toLocaleDateString()} ({ageFromDate(this.state.animal.birthdate)} ans) &middot; <Button variant="primary" onClick={() => this.showAnimalForm(true)}>Éditer</Button> &middot; <Button variant="danger" onClick={() => this.showAnimalDelete(true)}>Supprimer</Button></p>
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
                            <h2>Galerie</h2>
							<div className="row row-cols-1 row-cols-md-3">
                                {this.state.pictures.map((picture: string, index: number) => <div className="col mb-4"><SquareImage image={picture} key={index} /></div>)}
							</div>
						</div>
					</div>
					<AnimalForm show={this.state.showAnimalForm} animal={this.state.animal} onHide={() => this.showAnimalForm(false)} onSuccess={a => this.setState({ animal: a })} />
					<DeleteConfirmation prompt='Écrivez le nom de l’animal pour confirmer la suppression' expected={this.state.animal?.name} show={this.state.showAnimalDelete} onHide={() => this.showAnimalDelete(false)} onSuccess={() => {
						AnimalService.delete(this.state.id).then(() => history.push('/')).catch(() => this.setState({ error: 'Erreur lors de la suppression' }))
					}} />
				</React.Fragment>}
            </div>
		);
	}
}
