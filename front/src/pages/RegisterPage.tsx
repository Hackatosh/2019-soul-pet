import React from 'react';
import { authenticationService } from '../services';
import { Formik, Field, Form } from 'formik';
import { history } from '../helpers';

class RegisterPage extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);

	}

	render() {
		return (
			<div>
                <h1>Bienvenue sur SoulPet&nbsp;!</h1>
                <p>Rejoignez-vous pour retrouver tous nos conseils et événements pour vos animaux&nbsp;!</p>
                <Formik initialValues={{ username: '', email: '', password: '', confirmpassword:'' }} onSubmit={({ username, email, password, confirmpassword }, { setStatus, setSubmitting }) => {
					setStatus();
					authenticationService.register(username, email, password).then(() => {
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
              <div className='form-group'>
                <label htmlFor="username" className="sr-only">Pseudo</label>
                <Field name="username" placeholder="Nom d'utilisateur" className={'form-control'}/>
              </div>
              <div className='form-group'>
                <label htmlFor="email" className="sr-only">E-mail</label>
  							<Field name="email" type="email" placeholder="E-mail" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
              </div>
              <div className='form-group'>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
  							<Field name="password" type="password" placeholder="Mot de passe" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              </div>
              <div className='form-group'>
                <label htmlFor="password" className="sr-only">Confirmer votre mot de passe</label>
                <Field name="confirmpassword" type="password" placeholder="Mot de passe" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              </div>
							<button type="submit" className="btn btn-primary" disabled={isSubmitting}>S'enregister</button>
						</Form>
					)}
				</Formik>
            </div>
		);
	}
}

export { RegisterPage };
