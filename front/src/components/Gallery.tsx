import React from 'react';
import { Picture, Directory } from '../models';
import { SquareImage } from './SquareImage';
import { Button } from 'react-bootstrap';
import './Gallery.css';
import { AddImage } from '.';

export interface GalleryProps {
	pictures: Picture[];
	directory: Directory;
	add?: (file: File) => void;
	delete?: (index: number) => void;
	deletable: true | number[];
}

export class Gallery extends React.Component<GalleryProps> {
	render() {
		if (this.props.pictures.length === 0 && this.props.add === undefined)
			return (
				<div className="mt-3 alert alert-info">Il n’y a aucune photo pour le moment…</div>
			);
		return (
			<div className="row row-cols-1 row-cols-md-3">
				{this.props.add !== undefined &&
				<div className="col mb-4">
					<AddImage exportPicture={this.props.add} />
				</div>}
				{this.props.pictures.map((picture: Picture, index: number) => 
				<div className="col mb-4" key={index}>
					{this.props.delete !== undefined && (this.props.deletable === true || this.props.deletable.includes(picture.id)) &&
					<div className="mask-buttons">
						<Button variant="danger" onClick={() => this.props.delete !== undefined && this.props.delete(index)}>&times;</Button>
					</div>}
					<SquareImage image={picture} directory={this.props.directory} key={picture.filename} />
				</div>)}
			</div>
		);
	}
}
