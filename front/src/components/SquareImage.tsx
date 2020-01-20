import React from 'react';
import './SquareImage.css';

export interface SquareImageProps {
    image: string;
}

export class SquareImage extends React.Component<SquareImageProps> {
	render() {
		return (
			<div className="rounded img-fluid" style={{backgroundImage: `url(${this.props.image})`}}></div>
		);
	}
}
