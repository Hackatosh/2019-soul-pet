import React from 'react';
import {PetEvent, Specie} from '../models';
import {Modal, Form, Alert, Button} from 'react-bootstrap';
import {Formik, Field} from 'formik';
import {AnimalService, AuthenticationService, EventService} from '../services';
import { titleCase } from '../helpers';
import './EventForm.css';

export interface EventFormProps {
    /** If in edition mode, the current values of the event */
    event?: PetEvent,
    /** Called to hide the modal */
    onHide: () => void,
    /** Whether or not to show the modal */
    show: boolean,
    /** Called when the post of the event was successful */
    onSuccess: (event: PetEvent) => void
}

export interface EventFormState {
    error: string;
    species: Specie[];
}

/**
 * A form used to add or edit an event.
 */
export class EventForm extends React.Component<EventFormProps, EventFormState> {
    constructor(props: EventFormProps) {
        super(props);

        this.state = {error: '', species: []};
    }

    componentDidMount() {
        AnimalService.getSpecies().then(species => this.setState({species: species})).catch(() => this.setState({error: 'Erreur lors de la récupération des espèces'}));
    }

    render() {
		const creating = this.props.event === undefined;

        return (
            <Modal onHide={this.props.onHide} show={this.props.show} aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title-vcenter">{creating ? "Ajouter un événement" : "Modifier un événement"}</Modal.Title>
                </Modal.Header>
                <Formik onSubmit={values => {
					// We do not use `creating` here because if we do TypeScript does not know that
					// this.props.event is defined.
                    const event = this.props.event === undefined ? {} as PetEvent : this.props.event;
                    event.name = values.name;
                    event.beginDate = new Date(values.beginDate);
                    event.endDate = new Date(values.endDate);
                    event.description = values.description;
                    event.specieIds = values.specieIds.map(id => parseInt(id));
                    event.location = values.location;
                    // If we are adding a new event
                    if (creating) {
                        event.userId = AuthenticationService.User.id;
                        EventService.add(event).then(e => {
                            this.props.onSuccess(e);
                            this.props.onHide();
                        }).catch(() => this.setState({error: 'Erreur lors de la création de l’événement'}));
                    }
                    // Else we are editing an existing event
                    else
                        EventService.update(event).then(e => {
							e.userId = AuthenticationService.User.id;
                            this.props.onSuccess(e);
							this.props.onHide();
						}).catch(() => this.setState({error: 'Erreur lors de la mise à jour de l’événement'}));
				}}
				initialValues={this.props.event === undefined ?
				{name: '', beginDate: '', endDate: '', description: '', location:'', specieIds: []} :
				{
					name: this.props.event.name,
					beginDate: this.props.event.beginDate.toISOString().substr(0, 10),
					endDate: this.props.event.endDate.toISOString().substr(0, 10),
					description: this.props.event.description,
					location: this.props.event.location,
					specieIds: this.props.event.specieIds !== undefined ?
					this.props.event.specieIds.map(s => s.toString()) : [],
				}}>
					{props => (
					<Form onSubmit={props.handleSubmit}>
						<Modal.Body>
							{this.state.error !== '' &&
							<Alert variant="danger">{this.state.error}</Alert>
							}
							<Form.Group controlId="eventName">
								<Form.Label>Quel est le nom de votre événement&nbsp;?</Form.Label>
								<Form.Control name="name" type="text" placeholder="Entrez le nom de l’événement"
												onChange={props.handleChange} value={props.values.name} required/>
							</Form.Group>
							<div className="form-row">
								<div className="col-md">
									<Form.Group controlId="eventBeginDate">
										<Form.Label>Quand commence-t-il&nbsp;?</Form.Label>
										<Form.Control type="date" name="beginDate" onChange={props.handleChange}
														value={props.values.beginDate} required/>
									</Form.Group>
								</div>
								<div className="col-md">
									<Form.Group controlId="eventEndDate">
										<Form.Label>Quand se termine-t-il&nbsp;?</Form.Label>
										<Form.Control type="date" name="endDate" onChange={props.handleChange}
														value={props.values.endDate} required/>
									</Form.Group>
								</div>
							</div>
							<div className="form-row">
								<div className="col-md">
									<Form.Group controlId="eventLocation">
										<Form.Label>Où a lieu votre événement&nbsp;?</Form.Label>
										<Form.Control name="location" as="textarea"
												placeholder="Entrez l'adresse de l’événement"
												onChange={props.handleChange} value={props.values.location}
												required/>
									</Form.Group>
								</div>
								<div className="col-md">
									<Form.Group controlId="eventSpecies">
										<Form.Label>Quelles espèces sont les bienvenues&nbsp;?</Form.Label>
										<Field as="select" name="specieIds" className="form-control custom-select" multiple={true} onChange={(evt: Event) => {
											props.values.specieIds = Array.prototype.slice.call((evt.target as HTMLSelectElement).selectedOptions).map((option: HTMLOptionElement) => option.value);
											props.setFieldValue("specieIds", props.values.specieIds);
										}} value={props.values.specieIds} type="select-multiple" disabled={!creating}>
											{this.state.species.map(specie => <option value={specie.id} key={specie.id}>{titleCase(specie.name)}</option>)}
										</Field>
										{creating ? (
											<small className="form-text text-muted">Utilisez <kbd>ctrl</kbd> et <kbd>maj</kbd> pour sélectionner plusieurs espèces.</small>
										) : (
											<small className="form-text text-muted">Les espèces autorisées ne peuvent pas être modifiées <i>a posteriori</i>.</small>
										)}
									</Form.Group>
								</div>
							</div>
              <div className="form-row">
                <div className="col-md">
                  <Form.Group controlId="eventDescription">
                    <Form.Label>Une petite description&nbsp;?</Form.Label>
                    <Form.Control name="description" as="textarea"
                            placeholder="Entrez la description de l’événement"
                            onChange={props.handleChange} value={props.values.description}
                            required/>
                  </Form.Group>
                </div>
              </div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary"
									type="submit">{creating ? 'Ajouter' : 'Éditer'}</Button>
							<Button variant="secondary" onClick={this.props.onHide}>Annuler</Button>
						</Modal.Footer>
					</Form>
					)}
                </Formik>
            </Modal>
        );
    }
}
