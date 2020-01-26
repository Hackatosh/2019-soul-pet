import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent} from '../models';
import { history, httpClient, titleCase} from '../helpers';
import {EventService} from "../services/event.service";
import {Button, Spinner} from "react-bootstrap";
import { AuthenticationService} from "../services";
import { DeleteConfirmation} from "../components";
import {EventForm} from "../components/EventForm";

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
                <div className="col mb-4">
                    <div className="card">
                        <img src={peche} className="card-img-top"/>
                        <div className="card-body">
                            <h5 className="card-title">{event.name}</h5>
                            <p className="lead text-muted">
                                Organisé par {event.user ? event.user.username : "Inconnu(e)"} &middot;
                                {canModify ? <Button variant="primary"
                                                     onClick={() => this.showEventForm(true)}>Éditer</Button> : null} &middot;
                                {canModify ? <Button variant="danger"
                                                     onClick={() => this.showEventDelete(true)}>Supprimer</Button> : null}
                            </p>
                            <h6 className="card-title">Début : {event.beginDate.toDateString()}</h6>
                            <h6 className="card-title">Fin : {event.endDate.toDateString()}</h6>
                            <h6 className="card-title">{event.location ? `Localisation de l'évènement : ${event.location}` : 'Pas de localisation indiquée'}</h6>
                            <p className="card-text">{event.description}</p>
                        </div>
                    </div>
                    <EventForm show={this.state.showEventForm} event={this.state.event} onHide={() => this.showEventForm(false)} onSuccess={e => this.setState({ event: e })} />
                    <DeleteConfirmation prompt='Écrivez le nom de l’évènement pour confirmer la suppression' expected={this.state.event?.name} show={this.state.showEventDelete} onHide={() => this.showEventDelete(false)} onSuccess={() => {
                        EventService.delete(this.state.id).then(() => history.push('/')).catch(() => this.setState({ error: 'Erreur lors de la suppression' }))
                    }} />
                </div>
            )
        }
    }
}
