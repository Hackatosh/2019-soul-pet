import React from 'react';
import { AuthenticationService, AnimalService } from '../services';
import { RouteComponentProps } from 'react-router';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './HomePage.css';
import { AnimalCard } from '../components';
import { Animal, Specie } from '../models';
import { Formik } from 'formik';

export interface HomePageState {
    species: Specie[];
    animals: Animal[];
    addModal: boolean;
}

export class HomePage extends React.Component<RouteComponentProps, HomePageState> {
    private error = '';
    private formError = '';

    constructor(props: RouteComponentProps) {
        super(props);

        this.state = { species: [], animals: [], addModal: false };
    }

    componentDidMount() {
        AnimalService.getAll(AuthenticationService.User.id)
            .then((animals: Animal[]) => {
                AnimalService.getSpecies().then(species => this.setState({ species: species, animals: animals.reverse() }));
            }).catch(() => {
                this.error = 'Erreur lors de la récupération des animaux';
                this.setState({});
            });        
    }

    private showAddModal(state: boolean) {
        this.setState({ addModal: state });
    }

	render() {
		return (
			<div className="container">
                {this.error !== '' &&
                <div className="row mb-5">
					<div className="col-sm-6 offset-sm-3"><div className="alert alert-danger">{this.error}</div></div>
				</div>}
                {this.state.animals.length === 0 && 
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">Vous n’avez pas encore d’animaux…</div></div>
                </div>}
                <div className="row row-cols-2 row-cols-md-3 justify-content-center">
					<div className="col mb-4">
						<p className="text-center"><Button variant="success" onClick={() => this.showAddModal(true)}>Ajouter un autre animal</Button></p>
					</div>
				</div>
				<div className="row row-cols-2 row-cols-md-3 justify-content-center">
					{this.state.animals.map(a => <div className="col mb-4" key={a.id}><AnimalCard animal={a} /></div>)}
				</div>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered show={this.state.addModal} onHide={() => this.showAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Ajouter un animal</Modal.Title>
                    </Modal.Header>
                    <Formik onSubmit={values => {
                            AnimalService.add({ name: values.name, birthdate: new Date(values.birthdate), specieId: values.species, userId: AuthenticationService.User.id }).then(a => this.setState({ animals: [a].concat(this.state.animals)})).catch(() => {
                                this.formError = 'Erreur lors de l’enregistrement de l’animal';
                                this.setState({});
                            });
                            this.setState({ addModal: false });
                        }} initialValues={{name: '', birthdate: '', species: this.state.species.length > 0 ? this.state.species[0].id : 0}}>
                        {props => (
                        <Form onSubmit={props.handleSubmit}>
                            <Modal.Body>
                                {this.formError !== '' &&
                                <Alert variant="danger">{this.formError}</Alert>
                                }
                                <Form.Group controlId="animalName">
                                    <Form.Label>Comment s’appelle votre animal&nbsp;?</Form.Label>
                                    <Form.Control name="name" type="text" placeholder="Entrez son nom" onChange={props.handleChange} value={props.values.name} required />
                                </Form.Group>
                                <Form.Group controlId="animalBirthdate">
                                    <Form.Label>Quand est-il né&nbsp;?</Form.Label>
                                    <Form.Control type="date" name="birthdate" onChange={props.handleChange} value={props.values.birthdate} required />
                                </Form.Group>
                                <Form.Group controlId="animalSpecies">
                                    <Form.Label>Quelle espèce est-ce&nbsp;?</Form.Label>
                                    <Form.Control as="select" name="species" onChange={props.handleChange} noValidate>
                                        {this.state.species.map(specie => {
                                            specie.name = specie.name[0].toUpperCase() + specie.name.substr(1);
                                            return <option value={specie.id} key={specie.id}>{specie.name}</option>;
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" type="submit">Ajouter</Button>
                                <Button variant="secondary" onClick={() => this.showAddModal(false)}>Annuler</Button>
                            </Modal.Footer>
                        </Form>
                        )}
                    </Formik>
                </Modal>
            </div>
		);
	}
}
