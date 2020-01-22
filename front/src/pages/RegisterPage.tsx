import React from 'react';
import { AuthenticationService } from '../services';
import { Formik, Field, Form } from 'formik';
import { randomBackground, history } from '../helpers';
import { RouteComponentProps } from 'react-router';

export class RegisterPage extends React.Component<RouteComponentProps, {}> {
	constructor(props: RouteComponentProps) {
		super(props);

		if (AuthenticationService.isLoggedIn)
			history.push('/');
	}

	render() {
		return (
			<div className={"cover " + randomBackground()}>
				<div className="center-form text-white text-center">
					<div>
						<h1 className="display-2 mb-3">SoulPet</h1>
						<p className="lead mb-5">Le site pour prendre soin de vos animaux&nbsp;!</p>
						<Formik initialValues={{ username: '', email: '', password: '', confirmpassword:'' }} onSubmit={({ username, email, password, confirmpassword }, { setStatus, setSubmitting }) => {
							setStatus();
							if (confirmpassword !== password){
								setSubmitting(false);
								setStatus("Les mots de passe ne correspondent pas");
								return;
							}
							AuthenticationService.register(username, email, password).then(() => {
									const { from } = this.props.location.state || { from: { pathname: "/login", state: { fromRegistration: true } } };
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
									<label htmlFor="username" className="sr-only">Pseudo</label>
									<Field name="username" placeholder="Pseudo (plus de 3 caractères)" className={'form-control'}/>
									<label htmlFor="email" className="sr-only">E-mail</label>
									<Field name="email" type="email" placeholder="E-mail" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
									<label htmlFor="password" className="sr-only">Mot de passe</label>
									<Field name="password" type="password" placeholder="Mot de passe (plus de 8 caractères)" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
									<label htmlFor="password" className="sr-only">Confirmez votre mot de passe</label>
									<Field name="confirmpassword" type="password" placeholder="Mot de passe (confirmation)" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
									<button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>S'enregister</button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		);
	}
}
