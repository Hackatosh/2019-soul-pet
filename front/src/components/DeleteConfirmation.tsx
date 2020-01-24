import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';

export interface DeleteConfirmationProps {
	/** Called to hide the modal */
	onHide: () => void,
	/** Whether or not to show the modal */
	show: boolean,
	/** Displayed as a question to the user */
	prompt: string,
	/** Expected value */
	expected: string,
	/** Called when the confirmation was successful */
	onSuccess: () => void
}

/**
 * A form used to confirm the deletion of an object
 */
export class DeleteConfirmation extends React.Component<DeleteConfirmationProps, {}> {
	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} aria-labelledby="contained-modal-title-vcenter" centered>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Confirmer la suppression</Modal.Title>
				</Modal.Header>
				<Formik onSubmit={values => {
						if (values.name === this.props.expected) {
							this.props.onSuccess();
							this.props.onHide();
						}
					}}
					initialValues={{ name: '' }}>
					{props => (
					<Form onSubmit={props.handleSubmit}>
						<Modal.Body>
							<Form.Group controlId="name">
								<Form.Label>{this.props.prompt}</Form.Label>
								<Form.Control name="name" type="text" placeholder="Confirmez la suppression" onChange={props.handleChange} value={props.values.name} required />
							</Form.Group>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="danger" type="submit" disabled={props.values.name !== this.props.expected}>Confirmer</Button>
							<Button variant="secondary" onClick={this.props.onHide}>Annuler</Button>
						</Modal.Footer>
					</Form>
					)}
				</Formik>
			</Modal>
		);
	}
}
