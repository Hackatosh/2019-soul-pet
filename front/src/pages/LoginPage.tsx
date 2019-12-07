import React from 'react';
import { authenticationService } from '../services';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history, randomBackground } from '../helpers';

class LoginPage extends React.Component<RouteComponentProps, {}> {
	constructor(props: RouteComponentProps) {
		super(props);

		if (authenticationService.isLoggedIn) {
			history.push('/');
		}
	}

	render() {
		return (
			<div className={"cover " + randomBackground()}>
				<div className="center-form text-white text-center">
					<div>
						<h1 className="display-2 mb-3">SoulPet</h1>
						<p className="lead mb-5">Le site pour prendre soin de vos animaux&nbsp;!</p>
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
									{typeof this.props.location.state !== 'undefined' && 
									typeof this.props.location.state.fromRegistration !== 'undefined' && 
									typeof this.props.location.state.fromRegistration &&
										<div className="alert alert-success">Votre compte a bien été créé.</div>
									}
									{status &&
										<div className={'alert alert-danger'}>{status}</div>
									}
									<label htmlFor="email" className="sr-only">E-mail</label>
									<Field name="email" type="email" placeholder="E-mail" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
									<label htmlFor="password" className="sr-only">Mot de passe</label>
									<Field name="password" type="password" placeholder="Mot de passe" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
									<button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>Se connecter</button>
								</Form>
							)}
						</Formik>
					</div>
					<div>
						<p className="lead mb-3 mt-5">Vous n’êtes pas encore inscrit&nbsp;?</p>
						<Link className="btn btn-success" to="/register">Inscrivez-vous</Link>
					</div>
				</div>
            </div>
		);
	}
}

export { LoginPage };
