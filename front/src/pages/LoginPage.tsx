import React from 'react';
import { authenticationService } from '../services';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history } from '../helpers';

class LoginPage extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);

		if (authenticationService.isLoggedIn) {
			history.push('/');
		}
	}

	render() {
		return (
			<div>
				<div>
                <h1>Bienvenue sur SoulPet&nbsp;!</h1>
                <p>Connectez-vous pour retrouver tous nos conseils et événements pour vos animaux&nbsp;!</p>
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
							{status &&
                                <div className={'alert alert-danger'}>{status}</div>
                            }
							<label htmlFor="email" className="sr-only">E-mail</label>
							<Field name="email" type="email" placeholder="E-mail" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
							<label htmlFor="password" className="sr-only">Mot de passe</label>
							<Field name="password" type="password" placeholder="Mot de passe" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
							<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Se connecter</button>
						</Form>
					)}
				</Formik>
				</div>
				<div>
				<p> Vous n'êtes pas encore inscrits ? Cliquez ici pour rejoindre notre communauté ! : </p>
				<Link className="btn btn-success" to="/register">S'inscrire</Link>
				</div>
            </div>
		);
	}
}

export { LoginPage };
