import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent, NoImage, EventComment, Directory } from '../models';
import { history } from '../helpers';
import {EventService} from "../services/event.service";
import {Button, Spinner, Form} from "react-bootstrap";
import { AuthenticationService, PictureService} from "../services";
import { DeleteConfirmation, SquareImage, Comment, UserBadge, Gallery} from "../components";
import {EventForm} from "../components/EventForm";
import { Formik } from 'formik';
import { CommentsService } from '../services/comments.service';

export interface EventCardProps extends RouteComponentProps<{ id: string }> {
}

export interface EventPageState {
    id: number;
    error: string;
    event: PetEvent | undefined;
    showEventForm: boolean;
    showEventDelete: boolean;
}

export class EventPage extends Component<EventCardProps, EventPageState> {
    constructor(props: EventCardProps) {
        super(props);
        if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
            history.push('/404');
		this.state = {error: '', event: undefined, id: parseInt(this.props.match.params.id), showEventForm: false, showEventDelete: false};
		this.loadPicture = this.loadPicture.bind(this);
    }

    componentDidMount() {
        EventService.get(parseInt(this.props.match.params.id)).then(event => {
			event.eventPictures?.reverse();
			this.setState({event: event});
		}).catch(() => history.push('/404'));
    }

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    private showEventDelete(state: boolean) {
        this.setState({showEventDelete: state});
	}
	
	private loadPicture(f: File) {
		PictureService.postPicture(this.state.id, Directory.Events, f).then(p => {
			p.content = URL.createObjectURL(f);
			this.state.event?.eventPictures?.unshift(p);
			this.setState({ event: this.state.event });
		}).catch(e => this.setState({ error: e }));
	}

	private deletePicture(index: number) {
		if (this.state.event?.eventPictures === undefined) {
			this.setState({ error: 'Erreur lors de la suppression de l’image' });
			return;
		}
		PictureService.deletePicture(this.state.event?.eventPictures[index], Directory.Events).then(() => {
			this.state.event?.eventPictures?.splice(index, 1);
			this.setState({ event: this.state.event });
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
							{event.eventPictures !== undefined && event.eventPictures.length > 0 ? (
							<SquareImage image={event.eventPictures[0]} directory={Directory.Events} key={event.eventPictures[0].id} />
							) : (
							<SquareImage image={NoImage} />
							)}
						</div>
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							<h1 className="display-3 mb-3">{event.name}</h1>
							{canModify &&
							<div className="btn-group btn-group-lg mb-3">
								<Button variant="primary" onClick={() => this.showEventForm(true)}>Éditer</Button>
								<Button variant="danger"onClick={() => this.showEventDelete(true)}>Supprimer</Button>
							</div>}
							<p className="text-muted mb-3">
								Organisé par {event.user !== undefined ? <UserBadge user={event.user} /> : "Inconnu·e"}
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
						<div className="col-10 offset-1 offset-md-0 col-md-7">
							<h2>Galerie</h2>
							{event.eventPictures !== undefined &&
							<Gallery pictures={event.eventPictures} directory={Directory.Events}
							add={this.loadPicture} delete={this.deletePicture} 
							deletable={event.userId === AuthenticationService.User.id ? true : 
							event.eventPictures.filter(p => p.userId === AuthenticationService.User.id).map(p => p.id)}/>}
						</div>
					</div>
					<EventForm show={this.state.showEventForm} event={this.state.event} onHide={() => this.showEventForm(false)} onSuccess={e => this.setState({ event: e })} />
					<DeleteConfirmation prompt='Écrivez le nom de l’évènement pour confirmer la suppression' expected={this.state.event?.name} show={this.state.showEventDelete} onHide={() => this.showEventDelete(false)} onSuccess={() => {
						EventService.delete(this.state.id).then(() => history.push('/events/list')).catch(() => this.setState({ error: 'Erreur lors de la suppression' }))
					}} />
				</div>
            )
        }
    }
}
