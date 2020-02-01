import React, {Component, FormEvent} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent, NoImage, EventComment, Animal} from '../models';
import { history } from '../helpers';
import {Button, Spinner, Form, OverlayTrigger, Popover} from "react-bootstrap";
import { AuthenticationService, AnimalService, CommentsService, EventService} from "../services";
import { DeleteConfirmation, SquareImage, Comment, UserBadge, AnimalCard} from "../components";
import {EventForm} from "../components/EventForm";
import { Formik } from 'formik';

export interface EventCardProps extends RouteComponentProps<{ id: string }> {
}

export interface EventPageState {
    id: number;
    error: string;
    event: PetEvent | undefined;
    showEventForm: boolean;
	showEventDelete: boolean;
	availablePets: Animal[];
}

export class EventPage extends Component<EventCardProps, EventPageState> {
	constructor(props: EventCardProps) {
        super(props);
        if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
            history.push('/404');
		this.state = {error: '', event: undefined, id: parseInt(this.props.match.params.id), showEventForm: false, showEventDelete: false, availablePets: []};
		
		this.addAnimal = this.addAnimal.bind(this);
    }

    componentDidMount() {
        EventService.get(parseInt(this.props.match.params.id)).then(event => {
			this.setState({event: event});	
			this.updateAvailablePets(event);
			// TODO: Retrieve the user of the event to display it
		}).catch(() => history.push('/404'));
	}
	
	private updateAvailablePets(event: PetEvent) {
		AnimalService.getAll(AuthenticationService.User.id).then(animals => {
			this.setState({ availablePets: animals.filter(a => {
				if (event.specieIds === undefined)
					return true;
				return event.specieIds.includes(a.specieId);
			}) });
		});
	}

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    private showEventDelete(state: boolean) {
        this.setState({showEventDelete: state});
	}
	
	private addAnimal(id: number) {
		if (this.state.event === undefined)
			return;
		const event = this.state.event;
		const index = this.state.availablePets.findIndex(a => a.id === id);
		if (index === -1)
			return;
		EventService.addAnimal(this.state.id, id).then(() => {
			if (event.attendees === undefined)
				event.attendees = [this.state.availablePets[index]];
			else	
				event.attendees.push(this.state.availablePets[index]);
			this.setState({ event: event, availablePets: this.state.availablePets });
		}).catch(e => this.setState({ error: e }));
	}

	private removeAnimal(id: number) {
		if (this.state.event === undefined)
			return;
		const event = this.state.event;
		if (event.attendees === undefined)
			event.attendees = [];
		const index = event.attendees.findIndex(a => a.id === id);
		if (index === -1)
			return;
		EventService.removeAnimal(this.state.id, id).then(() => {
			if (event.attendees === undefined)
				return;
			event.attendees.splice(index, 1);
			this.setState({ event: event });
		}).catch(e => this.setState({ error: e }));
	}

    render() {
        if (this.state.event === undefined) {
            return <div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>;
        } else {
			const event = this.state.event;
			const canModify = event.userId === AuthenticationService.User.id;
			const isSameDay = event.beginDate.getTime() === event.endDate.getTime();
			const speciesPopover = (
				<Popover id="authorized-species">
					<Popover.Title as="h3">Espèces bievenues</Popover.Title>
					<Popover.Content>
						<ul className="m-0 pl-3">
							{event.authorizedSpecies?.map(s => <li key={s.id}>{s.name}</li>)}
						</ul>
					</Popover.Content>
				</Popover>
			);
            return (
				<div className="container">
					<div className="row">
						<div className="col-10 offset-1 col-md-3 mb-3">
							{/*this.state.animal.animalPictures !== undefined && this.state.animal.animalPictures.length > 0 ? (
							<SquareImage image={this.state.animal.animalPictures[0]} directory={Directory.Animals} key={this.state.animal.animalPictures[0].id} />
							) : (*/
							<SquareImage image={NoImage} />
							/*)*/}
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							<h1 className="mb-3">{event.name}</h1>
							{canModify &&
							<div className="btn-group btn-group-lg mb-3">
								<Button variant="primary" onClick={() => this.showEventForm(true)}>Éditer</Button>
								<Button variant="danger"onClick={() => this.showEventDelete(true)}>Supprimer</Button>
							</div>}
							<h2 className="mt-2">Détails</h2>
							<p className="text-muted mb-3">
								Organisé par {event.user !== undefined ? <UserBadge user={event.user} /> : "Inconnu·e"}
							</p>
							<ul className="list-group list-group-horizontal-sm mb-4 w-100">
								<li className="list-group-item">{event.location ? `Localisation de l'évènement : ${event.location}` : 'Pas de localisation indiquée'}</li>
								{isSameDay ? (
									<li className="list-group-item">Le {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
								) : (
									<React.Fragment>
										<li className="list-group-item">Début le {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
										<li className="list-group-item">Fin le {event.endDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
									</React.Fragment>
								)}
								<OverlayTrigger trigger="click" placement="top" overlay={speciesPopover}>
									<button className="list-group-item list-group-item-action list-group-item-primary w-auto text-primary">Voir les espèces bienvenues</button>
								</OverlayTrigger>
							</ul>
							<h2>Description</h2>
							<p className="lead">{event.description}</p>
							<h2 className="mt-4 mb-3">Animaux inscrits</h2>
							<div className="row">
								<div className="col-lg-4 mb-4">
									{this.state.availablePets.length === 0 ? (
									<div className="alert alert-info">Aucun de vos animaux ne peut être inscrit à cet événement…</div>
									) : (
									<ul className="list-group w-100">
										{this.state.availablePets.map(pet => {
											if (pet.id === undefined)
												return null;
											const id = pet.id;
											return (<li className="list-group-item d-flex justify-content-between align-items-center" key={id}>
												<Form.Check type="switch" id={id.toString()} label={pet.name}
												onChange={(e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).checked ? this.addAnimal(id) : this.removeAnimal(id)} value={id}
												checked={event.attendees?.find(p => p.id === id) !== undefined} />
											</li>);
										})}
									</ul>
									)}
								</div>
								<div className="col-lg-8">
									{event.attendees === undefined || event.attendees.length === 0 ? (
									<div className="alert alert-info">Il n’y a aucun animal d’inscrit pour le moment…</div>
									) : (
									<div className="row row-cols-1 row-cols-sm-2">
										{event.attendees.map(a => <div className="col mb-4" key={a.id}><AnimalCard animal={a} small /></div>)}
									</div>)}
								</div>
							</div>
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							<h2>Discussion</h2>
							<Formik onSubmit={(values, {setSubmitting, resetForm}) => {
								const comment: EventComment = {
									userId: AuthenticationService.User.id,
									eventId: event.id,
									text: values.text,
									createdAt: new Date()
								};
                        		CommentsService.post(comment).then(c => {
                  c.user = AuthenticationService.User;
									event.eventComments?.push(c);
									this.forceUpdate();
									resetForm();
                            	}).catch(() => this.setState({ error: 'Erreur lors de l’envoi du commentaire' })).finally(() => setSubmitting(false));
							}}
							initialValues={{ text: ''}}>
								{props => (
								<Form onSubmit={props.handleSubmit}>
									<Form.Group controlId="text">
										<Form.Control name="text" as="textarea" placeholder="Quelque chose à ajouter ?" onChange={props.handleChange} value={props.values.text} />
									</Form.Group>
									<div className="text-right mb-3"><Button type="submit" variant="success">Envoyer</Button></div>
								</Form>
								)}
							</Formik>
							{event.eventComments === undefined || event.eventComments.length === 0 ? (
							<div className="alert alert-primary">Il n’y a aucun commentaire pour le moment…</div>
							) :
							event.eventComments?.map(c => <Comment comment={c} key={c.id} />)
							}
						</div>
					</div>
					<EventForm show={this.state.showEventForm} event={this.state.event} onHide={() => this.showEventForm(false)} onSuccess={e => {
						this.setState({ event: e });
						this.updateAvailablePets(e);
					}} />
					<DeleteConfirmation prompt='Écrivez le nom de l’évènement pour confirmer la suppression' expected={this.state.event?.name} show={this.state.showEventDelete} onHide={() => this.showEventDelete(false)} onSuccess={() => {
						EventService.delete(this.state.id).then(() => history.push('/events/list')).catch(() => this.setState({ error: 'Erreur lors de la suppression' }))
					}} />
				</div>
            )
        }
    }
}
