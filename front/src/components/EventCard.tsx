import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {Link} from 'react-router-dom';
import {PetEvent} from '../models';

interface EventCardProps {
    event: PetEvent;
}

export class EventCard extends Component<EventCardProps> {
    render() {
		const {event} = this.props;
		const isSameDay = event.beginDate.getTime() === event.endDate.getTime();

        return (
            <div className="col mb-4">
                <div className="card">
                    <img src={peche} className="card-img-top" alt="Peche"/>
                    <div className="card-body">
						<h5 className="card-title">{event.name}</h5>
						<p className="card-text">
							{event.user && <span>Créé par <Link to={`/profile/${event.user.id}`} className="badge badge-primary" style={{ fontSize: '100%' }}>{event.user.username}</Link></span>} &middot;&nbsp;
                        	{isSameDay ? 'Le' : 'Du'} {event.beginDate.toLocaleDateString()}
							{!isSameDay && <span> au {event.endDate.toLocaleDateString()}</span>}
						</p>
                        <Link to={`/events/${event.id}`} className="btn btn-primary">Détails</Link>
                    </div>
                </div>
            </div>
        );
    }
}
