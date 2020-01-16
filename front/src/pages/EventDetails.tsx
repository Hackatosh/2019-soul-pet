import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {useParams, RouteComponentProps} from 'react-router-dom';
import {PetEvent} from '../models/PetEvent';

interface MatchParams {
  id: number;
}

const EVENT = [
  {id:1, title:"Ca alors", description:"Bonjour"}
]

interface EventCardProps extends RouteComponentProps<MatchParams> {
  event:PetEvent;
}

export class EventDetails extends Component<EventCardProps, {}> {
  render() {

    let {id} = useParams();

    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
              <h5 className="card-title">{this.props.match.params.id}</h5>
              <h6 className="card-title">le 25 mai</h6>
              <p className="card-text">bonjour</p>
              <h6 className="card-title">Organisé par moi</h6>
              </div>
            </div>
          </div>
    )
  }
}
