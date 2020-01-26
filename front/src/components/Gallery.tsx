import React from 'react';
import { Picture, Directory } from '../models';
import { SquareImage } from './SquareImage';
import { Button } from 'react-bootstrap';
import './Gallery.css';
import { AddImage } from '.';

export interface GalleryProps {
	pictures: Picture[];
	delete?: (index: number) => void;
	add?: (file: File) => void;
	directory: Directory;
}

export class Gallery extends React.Component<GalleryProps> {
	render() {
		return (
			<div className="row row-cols-1 row-cols-md-3">
				{this.props.add !== undefined &&
				<div className="col mb-4">
					<AddImage exportPicture={this.props.add} />
				</div>}
				{this.props.pictures.map((picture: Picture, index: number) => 
				<div className="col mb-4" key={index}>
					{this.props.delete !== undefined &&
					<div className="mask-buttons">
						<Button variant="danger" onClick={() => this.props.delete !== undefined && this.props.delete(index)}>&times;</Button>
					</div>}
					<SquareImage image={picture} directory={Directory.Animals} key={picture.filename} />
				</div>)}
			</div>
		);
	}
}
