import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {PetEvent, Directory, Picture, NoImage} from '../models';
import { UserBadge, SquareImage } from '.';
import { PictureService } from '../services';

interface EventCardProps {
	event: PetEvent;
	small?: boolean;
}

interface EventCardState {
	picture: Picture;
}

export class EventCard extends Component<EventCardProps, EventCardState> {
	constructor(props: EventCardProps) {
		super(props);
		this.state = { picture: {} as Picture }
	}

	componentDidMount() {
		PictureService.getPictures(this.props.event.id, Directory.Events).then(pictures => {
			if (pictures.length >= 1)
				this.setState({ picture: pictures[pictures.length - 1] });
			else
				this.setState({ picture: NoImage });
		});
	}

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
				<SquareImage image={this.state.picture} directory={Directory.Events} key={this.state.picture.filename} />
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
