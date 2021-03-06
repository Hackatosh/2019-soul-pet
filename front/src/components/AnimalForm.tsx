import React from 'react';
import { Animal, Specie } from '../models';
import { Modal, Form, Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { AnimalService, AuthenticationService } from '../services';
import { titleCase } from '../helpers';

export interface AnimalFormProps {
	/** If in edition mode, the current values of the animal */
	animal?: Animal,
	/** Called to hide the modal */
	onHide: () => void,
	/** Whether or not to show the modal */
	show: boolean,
	/** Called when the post of the animal was successful */
	onSuccess: (animal: Animal) => void
}

export interface AnimalFormState {
	error: string;
	species: Specie[];
}

/**
 * A form used to add or edit an animal.
 */
export class AnimalForm extends React.Component<AnimalFormProps, AnimalFormState> {
	constructor(props: AnimalFormProps) {
		super(props);

		this.state = { error: '', species: [] };
	}

	componentDidMount() {
		AnimalService.getSpecies().then(species => this.setState({ species: species })).catch(() => this.setState({ error: 'Erreur lors de la récupération des espèces' }));
	}
	
	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Ajouter un animal</Modal.Title>
                </Modal.Header>
                <Formik onSubmit={values => {
						const animal = this.props.animal === undefined ? {} as Animal : this.props.animal;
						animal.userId = AuthenticationService.User.id;
                        animal.name = values.name;
                        animal.birthdate = new Date(values.birthdate);
                        animal.specieId = parseInt(values.specieId);
                        animal.specie = this.state.species.find((s: Specie) => s.id === animal.specieId);
                        // If we are adding a new animal
                        if (this.props.animal === undefined)
                            AnimalService.add(animal).then(a => {
                                this.props.onSuccess(a);
                                this.props.onHide();
                            }).catch(() => this.setState({ error: 'Erreur lors de l’enregistrement de l’animal' }));
                        // Else we are editing an existing animal
                        else
                            AnimalService.update(animal).then(_ => {
                                this.props.onSuccess(animal);
                                this.props.onHide();
                            }).catch(() => this.setState({ error: 'Erreur lors de l’enregistrement de l’animal' }));
                    }}
                    initialValues={this.props.animal === undefined ? 
                        { name: '', birthdate: '', specieId: this.state.species.length > 0 ? this.state.species[0].id.toString() : '0' } : 
                        { name: this.props.animal.name, birthdate: this.props.animal.birthdate.toISOString().substr(0, 10), specieId: this.props.animal.specieId.toString() }}>
                    {props => (
                    <Form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            {this.state.error !== '' &&
                            <Alert variant="danger">{this.state.error}</Alert>
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
                                <Form.Control as="select" name="specieId" className="custom-select" onChange={props.handleChange} noValidate value={props.values.specieId}>
                                    {this.state.species.map(specie => <option value={specie.id.toString()} key={specie.id}>{titleCase(specie.name)}</option>)}
                                </Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">{this.props.animal === undefined ? 'Ajouter' : 'Éditer'}</Button>
                            <Button variant="secondary" onClick={this.props.onHide}>Annuler</Button>
                        </Modal.Footer>
                    </Form>
                    )}
                </Formik>
            </Modal>
		);
	}
}
