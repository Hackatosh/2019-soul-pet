import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {RouteComponentProps} from 'react-router-dom';
import {PetEvent} from '../models';
import {history, httpClient} from '../helpers';
import {EventService} from "../services/event.service";
import {Spinner} from "react-bootstrap";

export interface EventCardProps extends RouteComponentProps<{ id: string }> {
}

export interface EventPageState {
    error: string;
    event: PetEvent | undefined;
}

export class EventPage extends Component<EventCardProps, EventPageState> {

    constructor(props: EventCardProps) {
        super(props);
        if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
            history.push('/404');
        else
            this.state = {error: '', event: undefined};
    }

    componentDidMount() {
        EventService.get(parseInt(this.props.match.params.id)).then(event => this.setState({event: event})).catch(() => history.push('/404'));
    }

    render() {
        if (this.state.event === undefined) {
            return <div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>;
        } else {
            const event = this.state.event;
            return (
                <div className="col mb-4">
                    <div className="card">
                        <img src={peche} className="card-img-top"/>
                        <div className="card-body">
                            <h5 className="card-title">{event.name}</h5>
                            <h6 className="card-title">Organisé
                                par {event.user ? event.user.username : "Inconnu(e)"}</h6>
                            <h6 className="card-title">Début : {event.beginDate.toDateString()}</h6>
                            <h6 className="card-title">Fin : {event.endDate.toDateString()}</h6>
                            <h6 className="card-title">{event.location ? `Localisation de l'évènement : ${event.location}` : 'Pas de localisation indiquée'}</h6>
                            <p className="card-text">{event.description}</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
