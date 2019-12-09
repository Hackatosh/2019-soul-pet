import React from 'react';
import { authenticationService } from '../services';
import { RouteComponentProps } from 'react-router';
import parrot from '../resources/animals/parrot.jpg';
import sheep from '../resources/animals/sheep.jpg';
import rabbit from '../resources/animals/rabbit.jpg';
import { Link } from 'react-router-dom';
import './HomePage.css';

class HomePage extends React.Component<RouteComponentProps, {}> {
	render() {
		return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">Bonjour {authenticationService.currentUserValue.username}&nbsp;!</h1>
					</div>
				</div>
				<div className="row row-cols-2 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<div className="card">
							<img src={parrot} className="card-img-top" alt="Parrot" />
							<div className="card-body">
								<h5 className="card-title">AraKiri</h5>
								<p className="card-text">Né le 27 avril 1832 &middot; 22 photos &middot; 3 événements liés</p>
								<Link to="/animal/5" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<div className="card">
							<img src={sheep} className="card-img-top" alt="Sheep" />
							<div className="card-body">
								<h5 className="card-title">Brebiquette</h5>
								<p className="card-text">Née le 12 décembre 2017 &middot; 13 photos &middot; 32 événements liés</p>
								<Link to="/animal/4" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<div className="card">
							<img src={rabbit} className="card-img-top" alt="Rabbit" />
							<div className="card-body">
								<h5 className="card-title">Marlon Bundo</h5>
								<p className="card-text">Né le juin 2019 &middot; 127 photos &middot; 1 événement lié</p>
								<Link to="/animal/7" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<div className="card">
							<img src={parrot} className="card-img-top" alt="Parrot" />
							<div className="card-body">
								<h5 className="card-title">AraKiri</h5>
								<p className="card-text">Né le 27 avril 1832 &middot; 22 photos &middot; 3 événements liés</p>
								<Link to="/animal/5" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<div className="card">
							<img src={sheep} className="card-img-top" alt="Sheep" />
							<div className="card-body">
								<h5 className="card-title">Brebiquette</h5>
								<p className="card-text">Née le 12 décembre 2017 &middot; 13 photos &middot; 32 événements liés</p>
								<Link to="/animal/4" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<div className="card">
							<img src={rabbit} className="card-img-top" alt="Rabbit" />
							<div className="card-body">
								<h5 className="card-title">Marlon Bundo</h5>
								<p className="card-text">Né le juin 2019 &middot; 127 photos &middot; 1 événement lié</p>
								<Link to="/animal/7" className="btn btn-primary">Détails</Link>
							</div>
						</div>
					</div>
					<div className="col mb-4">
						<p className="text-center"><Link to="/animal/add" className="btn btn-success">Ajouter un autre animal</Link></p>
					</div>
				</div>
            </div>
		);
	}
}

export { HomePage };