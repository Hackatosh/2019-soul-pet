import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import notFound from '../resources/404.svg';

export class NotFoundPage extends React.Component<RouteComponentProps, {}> {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-12 text-white text-center">
						<h1 className="display-3 mb-3">Contenu introuvable</h1>
						<p className="lead mb-5">Coup dur, une erreur 404&nbsp;!</p>
						<img src={notFound} style={{maxHeight: '40vh'}} alt="" />
					</div>
				</div>
            </div>
		);
	}
}
