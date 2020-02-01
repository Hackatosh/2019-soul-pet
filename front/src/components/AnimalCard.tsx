import React from 'react';
import { Link } from 'react-router-dom';
import { Animal, Picture, NoImage, Directory } from '../models';
import { PictureService } from '../services';
import { SquareImage } from './SquareImage';

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
		this.state = { picture: {} as Picture, pictureCount: 0 };
	}

	componentDidMount() {
		if (this.props.animal.id !== undefined)
			PictureService.getPictures(this.props.animal.id, Directory.Animals).then(pictures => {
				this.setState({ pictureCount: pictures.length });
				if (pictures.length >= 1)
					this.setState({ picture: pictures[pictures.length - 1] });
				else
					this.setState({ picture: NoImage });
			});
	}

	render() {
		return (
			<div className="card">
				<SquareImage image={this.state.picture} directory={Directory.Animals} key={this.state.picture.filename} />
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
