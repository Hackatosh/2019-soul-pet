import React from 'react';
import { Link } from 'react-router-dom';
import parrot from '../resources/animals/parrot.jpg';
import { Animal } from '../models';

export interface AnimalCardProps {
	animal: Animal
}

export class AnimalCard extends React.Component<AnimalCardProps, {}> {
    render() {
		return (
			<div className="card ">
				<img src={parrot} className="card-img-top" alt="Parrot" />
				<div className="card-body">
					<h5 className="card-title">{this.props.animal.name}</h5>
					<p className="card-text">Né le {new Date(this.props.animal.birthdate).toLocaleDateString()} &middot; 0 photo &middot; {this.props.animal.events ? this.props.animal.events.length : 0} événement{this.props.animal.events && this.props.animal.events.length > 1 && "s"}</p>
					<Link to={"/animal/" + this.props.animal.id} className="btn btn-primary">Détails</Link>
				</div>
			</div>
		);
	}
}
