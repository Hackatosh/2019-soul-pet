import React, {Component} from 'react';
import peche from '../resources/events/peche.jpg';
import {useParams, RouteComponentProps} from 'react-router-dom';
import {PetEvent} from '../models/PetEvent';
import { history } from '../helpers';

export interface EventCardProps extends RouteComponentProps<{id: string}> {}

export interface EventPageState {
  error: string;
  id: number;
  event: PetEvent | undefined;
}

export class EventService {
	static async get(id: number): Promise<Animal> {
		return httpClient.get<Animal>(`/animals/${id}`, true).then(AnimalService.revive).catch(() => Promise.reject('Erreur lors de la récupération de l’animal'));
	}
}

export class EventDetails extends Component<EventCardProps, EventPageState> {

  constructor(props: EventCardProps) {
		super(props);
		if (this.props.match.params.id === undefined || isNaN(parseInt(this.props.match.params.id)))
			history.push('/404')
		else
            this.state = { error: '', id: parseInt(this.props.match.params.id), event: undefined};
	}

  componentDidMount() {
    const event:PetEvent = {id:1,title:"Mon event",description:"Ca alors quel evenement hors du commun",organisateur:"Moi meme",begin_date:new Date(),end_date:new Date()}
    this.setState({event: event}) ;
    }

  render() {

    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
              {this.state.event !== undefined &&
                <h5 className="card-title">{this.state.event.title}</h5>}
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
