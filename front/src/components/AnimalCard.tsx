import React from 'react';
import { Link } from 'react-router-dom';
import { Animal, Picture } from '../models';
import { PictureService, AnimalService } from '../services';
import { SquareImage } from './SquareImage';
import noimage from '../resources/image-fill.svg';

export interface AnimalCardProps {
	animal: Animal;
}

export interface AnimalCardState {
	picture: Picture;
	pictureCount: number;
}

export class AnimalCard extends React.Component<AnimalCardProps, AnimalCardState> {
	constructor(props: AnimalCardProps) {
		super(props);
		this.state = { picture: { id: 0, filename: '', picture: '' }, pictureCount: 0 };
	}

	componentDidMount() {
		if (this.props.animal.id !== undefined)
			AnimalService.getPictures(this.props.animal.id).then(pictures => {
				this.setState({ pictureCount: pictures.length });
				if (pictures.length > 1)
					PictureService.get('animals', pictures[pictures.length - 1].filename).then(p => {
						pictures[pictures.length - 1].picture = p;
						this.setState({ picture: pictures[pictures.length - 1] });
					});
				else {
					this.state.picture.picture = noimage;
					this.setState({ picture: this.state.picture });
				}
			});
	}

	render() {
		return (
			<div className="card">
				<SquareImage image={this.state.picture}/>
				<div className="card-body">
					<h5 className="card-title">{this.props.animal.name}</h5>
					<p className="card-text">Né le {this.props.animal.birthdate.toLocaleDateString()} 
					&nbsp;&middot; {this.state.pictureCount} photo{this.state.pictureCount > 1 && 's'} 
					&nbsp;&middot; {this.props.animal.events ? this.props.animal.events.length : 0} événement{this.props.animal.events && this.props.animal.events.length > 1 && "s"}</p>
					<Link to={"/animal/" + this.props.animal.id} className="btn btn-primary">Détails</Link>
				</div>
			</div>
		);
	}
}
