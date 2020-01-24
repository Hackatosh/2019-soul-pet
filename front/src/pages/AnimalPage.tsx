import React from 'react';
import { AnimalService, PictureService } from '../services';
import { RouteComponentProps } from 'react-router';
import './AnimalPage.css';
import { AnimalForm, DeleteConfirmation, SquareImage } from '../components';
import { Animal, Picture } from '../models';
import { Card, Button } from 'react-bootstrap';
import { history, titleCase, ageFromDate } from '../helpers';
import noimage from '../resources/image-fill.svg';

export interface AnimalPageProps extends RouteComponentProps<{id: string}> {}

export interface AnimalPageState {
    error: string;
    id: number;
    animal: Animal | undefined;
	showAnimalForm: boolean;
    showAnimalDelete: boolean;
}

export class AnimalPage extends React.Component<AnimalPageProps, AnimalPageState> {
    private fileInput: React.RefObject<HTMLInputElement>;

	constructor(props: AnimalPageProps) {
        super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else
            this.state = { error: '', id: parseInt(this.props.match.params.id), animal: undefined, showAnimalForm: false, showAnimalDelete: false };
        this.loadPicture = this.loadPicture.bind(this);
        this.fileInput = React.createRef();
	}

    componentDidMount() {
        AnimalService.getSingle(this.state.id).then(a => {
            this.setState({ animal: a });
            if (a.animalPictures !== undefined && a.animalPictures.length > 0) {
                a.animalPictures.reverse().forEach((p: Picture, i: number) => {
                    if (a.animalPictures !== undefined)
                        a.animalPictures[i].picture = '';
                    this.setState({ animal: this.state.animal });
                    PictureService.get('animals', p.filename).then(c => {
                        if (a.animalPictures !== undefined)
                            a.animalPictures[i].picture = c;
                    }).catch(_ => {
                        if (a.animalPictures !== undefined)
                            a.animalPictures[i].picture = noimage;
                    }).finally(() => this.setState({ animal: a }))
                });
            }
        }).catch(() => history.push('/404'));   
	}

    private showAnimalForm(state: boolean) {
        this.setState({ showAnimalForm: state });
	}
	
	private showAnimalDelete(state: boolean) {
        this.setState({ showAnimalDelete: state });
    }

    private loadPicture() {
        if (this.fileInput.current === null || this.fileInput.current.files === null)
            return;
        const picture = this.fileInput.current.files[0];
        AnimalService.postPicture(1, picture).then(p => {
            p.picture = URL.createObjectURL(picture);
            this.state.animal?.animalPictures?.unshift(p);
            this.setState({ animal: this.state.animal });
        }).catch(e => this.setState({ error: e }));
    }

    private deletePicture(index: number) {
        if (this.state.animal?.animalPictures === undefined) {
            this.setState({ error: 'Erreur lors de la suppression de l’image' });
            return;
        }
        AnimalService.deletePicture(this.state.animal?.animalPictures[index].filename).then(_ => {
            this.state.animal?.animalPictures?.splice(index, 1);
            this.setState({ animal: this.state.animal });
        }).catch(e => this.setState({ error: e }));
    }

    render() {
		return (
			<div className="container">
				{this.state.animal !== undefined && 
                <React.Fragment>
					<div className="row">
						<div className="col-10 offset-1 col-md-3">
                            {this.state.animal.animalPictures !== undefined && this.state.animal.animalPictures.length > 0 ? (
                            <SquareImage image={this.state.animal.animalPictures[0].picture} />
                            ) : (
                            <SquareImage image={noimage} />
                            )}
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							{this.state.error !== '' && <div className="alert alert-danger">{this.state.error}</div>}
							<h1 className="display-3">{this.state.animal.name}</h1>
							<p className="lead text-muted">{this.state.animal.specie !== undefined ? titleCase(this.state.animal.specie?.name) : ''} né le {this.state.animal.birthdate.toLocaleDateString()} ({ageFromDate(this.state.animal.birthdate)}) &middot; <Button variant="primary" onClick={() => this.showAnimalForm(true)}>Éditer</Button> &middot; <Button variant="danger" onClick={() => this.showAnimalDelete(true)}>Supprimer</Button></p>
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
                                <div className="col mb-4">
                                    <div className="bg-dark text-center add-picture">
                                        <Button onClick={() => this.fileInput.current?.click()} variant="success">Ajouter une photo</Button>
                                        <p className="text-muted">Taille limitée à 1&nbsp;Mo</p>
                                        <form encType="multipart/form-data">
                                            <input type="file" ref={this.fileInput} onChange={this.loadPicture} name="picture" />
                                        </form>
                                    </div>
                                </div>
                                {this.state.animal.animalPictures?.map((picture: Picture, index: number) => <div className="col mb-4" key={index}><div className="mask-buttons"><Button variant="danger" onClick={() => this.deletePicture(index)}>&times;</Button></div><SquareImage image={picture.picture} /></div>)}
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
