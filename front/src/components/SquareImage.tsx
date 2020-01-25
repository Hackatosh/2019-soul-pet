import React from 'react';
import './SquareImage.css';
import { Spinner } from 'react-bootstrap';
import { Picture } from '../models';

export interface SquareImageProps {
	image: Picture;
}

export class SquareImage extends React.Component<SquareImageProps> {
	render() {
		// We render a loading spinner if the content of the picture is an empty string.
		return this.props.image.content !== '' ? (
				<div className="rounded img-fluid" style={{backgroundImage: `url(${this.props.image.content})`}}></div>
			) : (
				<div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>
			);
	}
}
