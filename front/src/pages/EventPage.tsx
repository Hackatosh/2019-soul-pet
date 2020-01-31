import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent, NoImage, Animal} from '../models';
import { history } from '../helpers';
import {EventService} from "../services/event.service";
import {Button, Spinner, Form} from "react-bootstrap";
import { AuthenticationService, AnimalService} from "../services";
import { DeleteConfirmation, SquareImage} from "../components";
import {EventForm} from "../components/EventForm";

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
				if (event.specieIds === undefined || event.attendees === undefined)
					return true;
				// Note that we cannot use `attendees.includes(a)` because the objects may differ,
				// because of the way the back returns objects in different routes.
				return event.specieIds.includes(a.specieId) && event.attendees.find(attendee => attendee.id === a.id) === undefined;
			}) });
		});
	}

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    private showEventDelete(state: boolean) {
        this.setState({showEventDelete: state});
	}
	
	private addAnimal() {
		if (this.state.event === undefined)
			return;
		const event = this.state.event;
		const index = this.state.availablePets.findIndex(a => a.id === 1);
		if (index === -1)
			return;
		EventService.addAnimal(this.state.id, 1).then(() => {
			if (event.attendees === undefined)
				event.attendees = [this.state.availablePets[index]];
			else	
				event.attendees.push(this.state.availablePets[index]);
			this.state.availablePets.splice(index, 1);
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
			this.state.availablePets.push(...event.attendees.splice(index, 1));
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
            return (
				<div className="container">
					<div className="row">
						<div className="col-10 offset-1 col-md-3">
							{/*this.state.animal.animalPictures !== undefined && this.state.animal.animalPictures.length > 0 ? (
							<SquareImage image={this.state.animal.animalPictures[0]} directory={Directory.Animals} key={this.state.animal.animalPictures[0].id} />
							) : (*/
							<SquareImage image={NoImage} />
							/*)*/}
							{this.state.availablePets.length === 0 ? (
							<div className="alert alert-info mt-3">Aucun de vos animaux ne peut être inscrit à cet événement…</div>
							) : (
							<React.Fragment>
								<p className="mt-3 mb-1">Inscrire un animal :</p>
								<Form.Control as="select" size="lg" className="custom-select">
									{this.state.availablePets.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}
								</Form.Control>
								<button className="btn btn-success btn-block mt-1" onClick={this.addAnimal}>Inscrire</button>
							</React.Fragment>
							)}
							<ul className="list-group w-100">
								{this.state.event.attendees?.map(a => {
									if (a.id === undefined)
										return;
									const id = a.id;
									return (<li key={id} className="list-group-item">
										{a.name} <button type="button" className="close" aria-label="Close" onClick={() => this.removeAnimal(id)}><span aria-hidden="true">&times;</span></button>
									</li>);
								})}
							</ul>
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							<h1 className="display-3 mb-3">{event.name}</h1>
							{canModify &&
							<div className="btn-group btn-group-lg mb-3">
								<Button variant="primary" onClick={() => this.showEventForm(true)}>Éditer</Button>
								<Button variant="danger"onClick={() => this.showEventDelete(true)}>Supprimer</Button>
							</div>}
							<p className="text-muted mb-3">
								Organisé par {event.user !== undefined ? event.user.username : "Inconnu·e"}
							</p>
							<ul className="list-group list-group-horizontal w-100 mb-4">
								<li className="list-group-item">{event.location ? `Localisation de l'évènement : ${event.location}` : 'Pas de localisation indiquée'}</li>
								{isSameDay ? (
									<li className="list-group-item">Le {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
								) : (
									<React.Fragment>
										<li className="list-group-item">Début le {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
										<li className="list-group-item">Fin le {event.endDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</li>
									</React.Fragment>
								)}
							</ul>
							<p className="lead">{event.description}</p>
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
