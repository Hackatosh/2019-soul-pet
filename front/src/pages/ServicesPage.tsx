import React from 'react';
import { authenticationService } from '../services';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history, randomBackground } from '../helpers';
import { ServicesMap } from '../components';

class ServicesPage extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps){
    super(props);

    if (authenticationService.isLoggedIn){
      history.push('/services');
    }
  }

  render(){
    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">Bonjour {authenticationService.currentUserValue.username}&nbsp;!</h1>
          <ServicesMap />
        </div>
      </div>
      </div>
    );
  }
}




export { ServicesPage };
