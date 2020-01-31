import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {Link} from 'react-router-dom';
import {PetEvent} from '../models';
import { UserBadge } from '.';

interface EventCardProps {
    event: PetEvent;
}

export class EventCard extends Component<EventCardProps> {
    render() {
		const {event} = this.props;
		const isSameDay = event.beginDate.getTime() === event.endDate.getTime();

        return (
<<<<<<< HEAD
            <div className="col mb-4">
                <div className="card">
                    <img src={peche} className="card-img-top" alt="Peche"/>
                    <div className="card-body">
                        <h5 className="card-title">{event.name}</h5>
                        <h6 className="card-title">Organisé par {event.user ? event.user.username : "Inconnu·e"}</h6>
                        <h6 className="card-title">Début : {event.beginDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</h6>
                        <h6 className="card-title">Fin : {event.endDate.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}</h6>
                        <h6 className="card-title">Lieu : {event.location ? event.location : "Lieu inconnu"}</h6>
                        <p className="card-text">{event.description}</p>
                        <Link to={`/events/${event.id}`} className="btn btn-primary">Détails</Link>
                    </div>
                </div>
            </div>
        )
=======
            <div className="card">
				<img src={peche} className="card-img-top" alt="Peche"/>
				<div className="card-body">
					<h5 className="card-title">{event.name}</h5>
					<p className="card-text">
						{event.user && <span>Créé par <UserBadge user={event.user} /></span>} &middot;&nbsp;
						{isSameDay ? 'Le' : 'Du'} {event.beginDate.toLocaleDateString()}
						{!isSameDay && <span> au {event.endDate.toLocaleDateString()}</span>}
					</p>
					<Link to={`/events/${event.id}`} className="btn btn-primary">Détails</Link>
				</div>
			</div>
        );
>>>>>>> master
    }
}
