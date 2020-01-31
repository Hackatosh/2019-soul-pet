import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {Link} from 'react-router-dom';
import {PetEvent} from '../models';
import { UserBadge } from '.';

interface EventCardProps {
	event: PetEvent;
	small?: boolean;
}

export class EventCard extends Component<EventCardProps> {
    render() {
		const {event} = this.props;
		const isSameDay = event.beginDate.getTime() === event.endDate.getTime();

		if (this.props.small)
			return (
				<div className="card">
					<Link to={`/events/${event.id}`} className="stretched-link text-decoration-none text-reset">
						<img src={peche} className="card-img-top" alt="Peche"/>
						<div className="card-body">
							<p className="card-text">{event.name}</p>
						</div>
					</Link>
				</div>
			);
        return (
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
    }
}
