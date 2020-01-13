import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {PetEvent} from '../models/PetEvent';

interface EventCardProps {
  event:PetEvent;
}

export class EventDetails extends Component<EventCardProps, {}> {
  render() {

    const {event} = this.props;

    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
              <h5 className="card-title">{event.title}</h5>
              <h6 className="card-title">le 25 mai</h6>
              <p className="card-text">{event.description}</p>
              <h6 className="card-title">Organisé par {event.organisateur}</h6>
              </div>
            </div>
          </div>
    )
  }
}
