import React from 'react';
import { authenticationService } from '../services';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history, randomBackground } from '../helpers';
import { ServicesMap } from '../components';



class ServicesPage extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps){
    super(props);


  }


  render(){
    const data = {
        lat: 48.864716,
        lon: 2.349014,
        zoom : 10,
        size : "400px",
        markers: [
          {
            key: "marker1",
            position: [48.86471, 2.349014],
            info:"General Kenobi",
            serviceType: "vets"
          },
          {
            key: "marker2",
            position: [48.86, 2.349016],
            info:"You are a bold one",
            serviceType: "parcs"
          }
        ]
      };


    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">Bonjour {authenticationService.currentUserValue.username}&nbsp;!</h1>
          <ServicesMap {...data}/>
        </div>
      </div>
      </div>
    );
  }
}




export { ServicesPage };
