import React from 'react';
import { authenticationService } from '../services';
import { Formik, Field, Form } from 'formik';

class LoginPage extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
		
		this.state = {
			email: '',
			password: ''
		};
	}

	render() {
		return (
			<div>
                <h1>Welcome!</h1>
                <p>You’re logged in with React and JWT!</p>
                <h3>Users from secure api end point:</h3>
				<Formik initialValues={{ email: '', password: '' }} onSubmit={({ email, password }, { setStatus, setSubmitting }) => {
					setStatus();
					authenticationService.login(email, password).then(() => {
						const { from } = this.props.location.state || { from: { pathname: "/" } };
							this.props.history.push(from);
						},
						error => {
							setSubmitting(false);
							setStatus(error);
						}
					);
				}}>
					{({ errors, status, touched, isSubmitting }) => (
						<Form>
							<div className="form-group">
								<label htmlFor="email">E-mail</label>
								<Field name="email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
							</div>
							<div className="form-group">
								<label htmlFor="password">Mot de passe</label>
								<Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
							</div>
							<div className="form-group">
								<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Se connecter</button>
							</div>
						</Form>
					)}
				</Formik>
            </div>
		);
	}
}

export { LoginPage };