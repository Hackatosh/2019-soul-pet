import React from 'react';
import './SquareImage.css';
import { Spinner } from 'react-bootstrap';
import { Picture } from '../models';

export interface SquareImageProps {
	image: Picture;
}

export class SquareImage extends React.Component<SquareImageProps> {
	render() {
		// We render a loading spinner if the image is an empty string.
		return this.props.image.picture !== '' ? (
				<div className="rounded img-fluid" style={{backgroundImage: `url(${this.props.image.picture})`}}></div>
			) : (
				<div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>
			);
	}
}
