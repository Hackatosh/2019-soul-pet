import React from 'react';
import { AuthenticationService, AnimalService } from '../services';
import { RouteComponentProps } from 'react-router';
import parrot from '../resources/animals/parrot.jpg';
import sheep from '../resources/animals/sheep.jpg';
import rabbit from '../resources/animals/rabbit.jpg';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { AnimalCard } from '../components';
import { Animal } from '../models';

export interface HomePageState {
    animals: Animal[];
}

export class HomePage extends React.Component<RouteComponentProps, HomePageState> {
    private error = '';

    constructor(props: RouteComponentProps) {
        super(props);

        this.state = { animals: [] };
    }

    componentDidMount() {
        AnimalService.getAll(AuthenticationService.User.id)
            .then((animals: Animal[]) => this.setState({ animals: animals })).catch(() => {
                this.error = 'Erreur lors de la récupération des animaux';
                this.setState({});
            });
    }

	render() {
		return (
			<div className="container">
                {this.error !== '' &&
                <div className="row mb-5">
					<div className="col-sm-6 offset-sm-3"><div className="alert alert-danger">{this.error}</div></div>
				</div>}
                {this.state.animals.length == 0 && 
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">Vous n’avez pas encore d’animaux…</div></div>
                </div>}
                <div className="row row-cols-2 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<p className="text-center"><Link to="/animal/add" className="btn btn-success">Ajouter un autre animal</Link></p>
					</div>
				</div>
				<div className="row row-cols-2 row-cols-md-3 justify-content-center">
					{this.state.animals.map(a => <div className="col mb-4" key={a.id}><AnimalCard animal={a} /></div>)}
				</div>
            </div>
		);
	}
}
