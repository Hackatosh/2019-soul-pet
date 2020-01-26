import React from 'react';
import {PetEvent, Specie} from '../models';
import {Modal, Form, Alert, Button} from 'react-bootstrap';
import {Field, FieldArray, Formik} from 'formik';
import {AnimalService, AuthenticationService} from '../services';
import {EventService} from "../services/event.service";

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
 * A form used to add or edit an event
 * TODO : ADD SPECIES AND LOCATION SUPPORT
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
        return (
            <Modal onHide={this.props.onHide} show={this.props.show} aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title-vcenter">{this.props.event === undefined ? "Ajouter un évènement" : "Modifier un évènement"}</Modal.Title>
                </Modal.Header>
                <Formik onSubmit={values => {
                    const event = this.props.event === undefined ? {} as PetEvent : this.props.event;
                    event.name = values.name;
                    event.beginDate = new Date(values.beginDate);
                    event.endDate = new Date(values.endDate);
                    event.description = values.description;
                    event.authorizedSpecies = values.authorizedSpecies;
                    // If we are adding a new event
                    if (this.props.event === undefined) {
                        event.userId = AuthenticationService.User.id;
                        EventService.add(event).then(e => {
                            this.props.onSuccess(e);
                            this.props.onHide();
                        }).catch(() => this.setState({error: 'Erreur lors de la création de l’évènement'}));
                    }
                    // Else we are editing an existing event
                    else {
                        EventService.update(event).then(_ => {
                            this.props.onSuccess(event);
                            this.props.onHide();
                        }).catch(() => this.setState({error: 'Erreur lors de la mise à jour de l’évènement'}));
                    }
                }}
                        initialValues={this.props.event === undefined ?
                            {name: '', beginDate: '', endDate: '', description: '', authorizedSpecies: []} :
                            {
                                name: this.props.event.name,
                                beginDate: this.props.event.beginDate.toISOString().substr(0, 10),
                                endDate: this.props.event.endDate.toISOString().substr(0, 10),
                                description: this.props.event.description,
                                authorizedSpecies: this.props.event.authorizedSpecies !== undefined ? this.props.event.authorizedSpecies : [],
                            }}
                    render = {props => (
                        <Form onSubmit={props.handleSubmit}>
                            <Modal.Body>
                                {this.state.error !== '' &&
                                <Alert variant="danger">{this.state.error}</Alert>
                                }
                                <Form.Group controlId="eventName">
                                    <Form.Label>Quel est le nom de votre évènement&nbsp;?</Form.Label>
                                    <Form.Control name="name" type="text" placeholder="Entrez le nom de l'évènement"
                                                  onChange={props.handleChange} value={props.values.name} required/>
                                </Form.Group>
                                <Form.Group controlId="eventBeginDate">
                                    <Form.Label>Quand commence-t-il ?&nbsp;?</Form.Label>
                                    <Form.Control type="date" name="beginDate" onChange={props.handleChange}
                                                  value={props.values.beginDate} required/>
                                </Form.Group>
                                <Form.Group controlId="eventEndDate">
                                    <Form.Label>Quand se termine-t-il&nbsp;?</Form.Label>
                                    <Form.Control type="date" name="endDate" onChange={props.handleChange}
                                                  value={props.values.endDate} required/>
                                </Form.Group>
                                <Form.Group controlId="eventDescription">
                                    <Form.Label>Une petite description&nbsp;?</Form.Label>
                                    <Form.Control name="description" type="text"
                                                  placeholder="Entrez la description de l'évènement"
                                                  onChange={props.handleChange} value={props.values.description}
                                                  required/>
                                </Form.Group>
                            </Modal.Body>
                            <FieldArray
                                name="authorizedSpecies"
                                render={arrayHelpers => (
                                    <div>
                                        {props.values.authorizedSpecies.map((specie, index) => (
                                            <div key={index}>
                                                <Field name={`authorizedSpecies[${index}].name`} />
                                                <button type="button" onClick={() => arrayHelpers.remove(index)}>
                                                    -
                                                </button>
                                            </div>
                                        ))}
                                        <select
                                            onChange={event => {
                                                const id:number = parseInt(event.target.value);
                                                const currentSpecieIds = props.values.authorizedSpecies !== undefined ? props.values.authorizedSpecies.map(specie => specie.id) : [];
                                                if(currentSpecieIds.find(value => value === id) === undefined){
                                                    const currentSpecie = this.state.species.find(value => value.id === id);
                                                    if(currentSpecie !== undefined){
                                                        arrayHelpers.push(currentSpecie);
                                                    }
                                                }
                                            }}
                                        >
                                            {this.state.species.map(specie => {
                                                specie.name = specie.name[0].toUpperCase() + specie.name.substr(1);
                                                return <option value={specie.id} key={specie.id}>{specie.name}</option>;
                                            })}
                                        </select>
                                    </div>
                                )}
                            />
                            <Modal.Footer>
                                <Button variant="primary"
                                        type="submit">{this.props.event === undefined ? 'Ajouter' : 'Éditer'}</Button>
                                <Button variant="secondary" onClick={this.props.onHide}>Annuler</Button>
                            </Modal.Footer>
                        </Form>
                    )}>
                </Formik>
            </Modal>
        );
    }
}