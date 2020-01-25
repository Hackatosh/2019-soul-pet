import React from 'react';
import { Picture, Directory, NoImage } from '../models';
import { SquareImage } from './SquareImage';
import { Button } from 'react-bootstrap';
import './Gallery.css';
import { PictureService } from '../services';
import { AddImage } from '.';

export interface GalleryProps {
	pictures: Picture[];
	delete?: (index: number) => void;
	add?: (file: File) => void;
	directory: Directory;
}

export interface GalleryState {
	error: string;
	pictures: Picture[];
}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
	constructor(props: GalleryProps) {
		super(props);
		this.state = { error: '', pictures: props.pictures };
	}

	componentDidMount() {
		this.setState({ pictures: this.props.pictures.map((p: Picture) => {
			p.content = '';
			return p;
		}) });
		this.props.pictures.forEach((p: Picture, i: number) => {
			PictureService.loadPictureContent(this.props.directory, p).then(loadedPicture => {
				this.props.pictures[i] = loadedPicture;
			}).catch(_ => {
				this.props.pictures[i] = NoImage;
			}).finally(() => {
				this.setState({ pictures: this.props.pictures });
			});
		});
	}

	render() {
		return (
			<div className="row row-cols-1 row-cols-md-3">
				{this.props.add !== undefined &&
				<div className="col mb-4">
					<AddImage exportPicture={this.props.add} />
				</div>}
				{this.state.pictures.map((picture: Picture, index: number) => 
				<div className="col mb-4" key={index}>
					{this.props.delete !== undefined &&
					<div className="mask-buttons">
						<Button variant="danger" onClick={() => this.props.delete !== undefined && this.props.delete(index)}>&times;</Button>
					</div>}
					<SquareImage image={picture} />
				</div>)}
			</div>
		);
	}
}
