import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import { Link } from 'react-router-dom';
import {PetEvent} from '../models';

interface EventCardProps {
  event:PetEvent;
}

export class EventCard extends Component<EventCardProps,{}> {

  render() {

    const {event} = this.props;

    return (
      <div className="col mb-4">
        <div className="card">
          <img src={peche} className="card-img-top" alt="Peche" />
          <div className="card-body">
            <h5 className="card-title">{event.name}</h5>
            <h6 className="card-title">Début : {event.beginDate.toDateString()}</h6>
            <h6 className="card-title">Fin : {event.endDate.toDateString()}</h6>
            <p className="card-text">{event.description}</p>
            <h6 className="card-title">Organisé par {event.user ? event.user.username : "Inconnu(e)"}</h6>
            <Link to={`/events/${event.id}`} className="btn btn-primary">Détails</Link>
          </div>
        </div>
      </div>
    )
  }
}
