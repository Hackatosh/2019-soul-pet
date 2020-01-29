import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent, EventComment} from '../models';
import { history } from '../helpers';
import {EventService} from "../services/event.service";
import {Button, Spinner, Form} from "react-bootstrap";
import { AuthenticationService} from "../services";
import { DeleteConfirmation, Comment } from "../components";
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
        else
            this.state = {error: '', event: undefined, id: parseInt(this.props.match.params.id), showEventForm: false, showEventDelete: false};
    }

    componentDidMount() {
        EventService.get(parseInt(this.props.match.params.id)).then(event => this.setState({event: event})).catch(() => history.push('/404'));
    }

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    private showEventDelete(state: boolean) {
        this.setState({showEventDelete: state});
    }

    render() {
        if (this.state.event === undefined) {
            return <div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>;
        } else {
			const event = this.state.event;
			const canModify = event.userId === AuthenticationService.User.id;
            return (
				<div className="container">
					<div className="row">
						<div className="col-10 offset-1 col-md-3">
							<div className="card">
								<img src={peche} className="card-img-top" alt={"The event"}/>
								<div className="card-body">
									<h5 className="card-title">{event.name}</h5>
									<p className="lead text-muted">
										Organisé par {event.user ? event.user.username : "Inconnu·e"} &middot;&nbsp;
										{canModify ? <Button variant="primary"
															onClick={() => this.showEventForm(true)}>Éditer</Button> : null} &middot;&nbsp;
										{canModify ? <Button variant="danger"
															onClick={() => this.showEventDelete(true)}>Supprimer</Button> : null}
									</p>
									<h6 className="card-title">Début : {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</h6>
									<h6 className="card-title">Fin : {event.endDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</h6>
									<h6 className="card-title">{event.location ? `Localisation de l'évènement : ${event.location}` : 'Pas de localisation indiquée'}</h6>
									<p className="card-text">{event.description}</p>
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
					<EventForm show={this.state.showEventForm} event={this.state.event} onHide={() => this.showEventForm(false)} onSuccess={e => this.setState({ event: e })} />
					<DeleteConfirmation prompt='Écrivez le nom de l’évènement pour confirmer la suppression' expected={this.state.event?.name} show={this.state.showEventDelete} onHide={() => this.showEventDelete(false)} onSuccess={() => {
						EventService.delete(this.state.id).then(() => history.push('/events/list')).catch(() => this.setState({ error: 'Erreur lors de la suppression' }))
					}} />
				</div>
            )
        }
    }
}
