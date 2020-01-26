import React from 'react';
import './SquareImage.css';
import { Spinner } from 'react-bootstrap';
import { Picture, Directory, NoImage } from '../models';
import { PictureService } from '../services';

export interface SquareImageProps {
	image: Picture;
	directory?: Directory;
}

export interface SquareImageState {
	content: string;
}

export class SquareImage extends React.Component<SquareImageProps, SquareImageState> {
	constructor(props: SquareImageProps) {
		super(props);
		this.state = { content: props.image.content === undefined ? '' : props.image.content };
	}

	componentDidMount() {
		this.loadPicture();
	}

	componentDidUpdate(prevProps: SquareImageProps) {
		if (this.props.image.filename !== prevProps.image.filename)
			this.loadPicture();
	}

	private loadPicture() {
		if (this.props.directory !== undefined && this.state.content === '' && this.props.image.filename !== undefined)
			PictureService.loadPictureContent(this.props.directory, this.props.image).then(p => this.setState({ content: p.content })).catch(_ => this.setState({ content: NoImage.content }));
	}

	render() {
		// We render a loading spinner if the content of the picture is an empty string.
		return this.state.content !== '' ? (
				<div className="rounded img-fluid" style={{backgroundImage: `url(${this.state.content})`}}></div>
			) : (
				<div className="rounder spinner-fluid"><Spinner animation="border" variant="success"/></div>
			);
	}
}
