import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {useParams, RouteComponentProps} from 'react-router-dom';
import {PetEvent} from '../models';
import { history, httpClient } from '../helpers';
import {EventService} from "../services/event.service";

export interface EventCardProps extends RouteComponentProps<{id: string}> {}

export interface EventPageState {
  error: string;
  id: number;
  event: PetEvent | undefined;
}
export class EventPage extends Component<EventCardProps, EventPageState> {

  constructor(props: EventCardProps) {
		super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404');
		else
            this.state = { error: '', id: parseInt(this.props.match.params.id), event: undefined};
	}

  componentDidMount() {
    EventService.get(this.state.id).then(event => this.setState({ event: event })).catch(() => history.push('/404'));
    }

  render() {
    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
              {this.state.event !== undefined &&
                <h5 className="card-title">{this.state.event.name}</h5>}
              {this.state.event === undefined &&
                <h5 className="card-title">INDEFINI !!!!11!1!</h5>}
              <h6 className="card-title">le 25 mai</h6>
              <p className="card-text">bonjour</p>
              <h6 className="card-title">Organisé par moi</h6>
              </div>
            </div>
          </div>
    )
  }
}
