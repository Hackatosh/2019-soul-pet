import React from 'react';
import './SquareImage.css';
import { Spinner } from 'react-bootstrap';

export interface SquareImageProps {
	image: string;
}

export class SquareImage extends React.Component<SquareImageProps> {
	render() {
		// We render a loading spinner if the image is an empty string.
		return this.props.image !== '' ? (
				<div className="rounded img-fluid" style={{backgroundImage: `url(${this.props.image})`}}></div>
			) : (
				<div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>
			);
	}
}
