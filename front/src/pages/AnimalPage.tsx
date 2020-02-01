import React from 'react';
import { AnimalService, AuthenticationService, PictureService } from '../services';
import { RouteComponentProps } from 'react-router';
import './AnimalPage.css';
import { AnimalForm, DeleteConfirmation, SquareImage, Gallery, EventCard, UserBadge } from '../components';
import { Button } from 'react-bootstrap';
import { Animal, NoImage, Directory, User } from '../models';
import { history, titleCase, ageFromDate } from '../helpers';

export interface AnimalPageProps extends RouteComponentProps<{id: string}> {}

export interface AnimalPageState {
	error: string;
	id: number;
	animal: Animal | undefined;
	showAnimalForm: boolean;
	showAnimalDelete: boolean;
	canModify: boolean;
	user: User;
}

export class AnimalPage extends React.Component<AnimalPageProps, AnimalPageState> {
	constructor(props: AnimalPageProps) {
		super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else
			this.state = { error: '', id: parseInt(this.props.match.params.id), animal: undefined, showAnimalForm: false, showAnimalDelete: false, canModify: false, user: {} as User };
		this.loadPicture = this.loadPicture.bind(this);
		this.deletePicture = this.deletePicture.bind(this);
	}

	componentDidMount() {
		AnimalService.getSingle(this.state.id).then(a => {
			a.animalPictures?.reverse();
			this.setState({ animal: a, canModify: a.userId === AuthenticationService.User.id });
			if (a.userId !== AuthenticationService.User.id)
				AuthenticationService.getProfile(a.userId).then(u => this.setState({ user: u }));
			PictureService.getPictures(this.state.id, Directory.Animals).then(pictures => {
				a.animalPictures = pictures.reverse()
				this.setState({ animal: a });
			});
		}).catch(() => history.push('/404'));   
	}

	private showAnimalForm(state: boolean) {
		this.setState({ showAnimalForm: state });
	}
	
	private showAnimalDelete(state: boolean) {
		this.setState({ showAnimalDelete: state });
	}

	private loadPicture(f: File) {
		PictureService.postPicture(this.state.id, Directory.Animals, f).then(p => {
			p.content = URL.createObjectURL(f);
			this.state.animal?.animalPictures?.unshift(p);
			this.setState({ animal: this.state.animal });
		}).catch(e => this.setState({ error: e }));
	}

	private deletePicture(index: number) {
		if (this.state.animal?.animalPictures === undefined) {
			this.setState({ error: 'Erreur lors de la suppression de l’image' });
			return;
		}
		PictureService.deletePicture(this.state.animal?.animalPictures[index], Directory.Animals).then(_ => {
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
							<SquareImage image={this.state.animal.animalPictures[0]} directory={Directory.Animals} key={this.state.animal.animalPictures[0].id} />
							) : (
							<SquareImage image={NoImage} />
							)}
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							{this.state.error !== '' && <div className="alert alert-danger">{this.state.error}</div>}
							<h1 className="display-3">{this.state.animal.name}</h1>
							<p className="lead text-muted">{this.state.animal.specie !== undefined ? titleCase(this.state.animal.specie?.name) : ''} né le {this.state.animal.birthdate.toLocaleDateString()} ({ageFromDate(this.state.animal.birthdate)})</p>
							{this.state.canModify ? (
							<div className="btn-group btn-group-lg mb-3">
								<Button variant="primary" onClick={() => this.showAnimalForm(true)}>Éditer</Button>
								<Button variant="danger" onClick={() => this.showAnimalDelete(true)}>Supprimer</Button>
							</div>) : (
								<p>Appartient à <UserBadge user={this.state.user} /></p>
							)}
							<h2>Événements</h2>
							{this.state.animal.events === undefined || this.state.animal.events.length === 0 ? (
							<div className="alert alert-info">Cet animal n’est inscrit à aucun événement.</div>
							) : (
							<div className="row row-cols-1 row-cols-md-3">
								{this.state.animal.events?.filter(e => e.endDate.getTime() >= Date.now()).map(e => <div className="col mb-4" key={e.id}><EventCard event={e} small /></div>)}
							</div>
							)}
							<h2 className="mt-4">Galerie</h2>
							{this.state.animal.animalPictures !== undefined &&
							<Gallery pictures={this.state.animal.animalPictures} directory={Directory.Animals}
							delete={this.state.canModify ? this.deletePicture : undefined} add={this.state.canModify ? this.loadPicture : undefined} deletable={true} />}
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
