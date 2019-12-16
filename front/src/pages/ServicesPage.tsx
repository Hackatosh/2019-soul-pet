import React from 'react';
import { authenticationService } from '../services';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history, randomBackground } from '../helpers';
import { ServicesMap } from '../components';
import './ServicesPage.css';


class ServicesPage extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps){
    super(props);


  }


  render(){
    const data = {
        lat: 48.864716,
        lon: 2.349014,
        zoom : 14,
        size : "500px",
        markers: [
          {
            key: "marker1",
            position: [48.86471, 2.349014],
            info:"Dr Obiwan Kenobi, 18b rue Tiquetonne",
            serviceType: "vets"
          },
          {
            key: "marker2",
            position: [48.865, 2.338],
            info:"Parc Grasswalker",
            serviceType: "parcs"
          },
          {
            key: "marker3",
            position: [48.86, 2.36],
            info:"Chewbacca's style, 3 rue des Quatre Fils",
            serviceType: "toiletteurs"
          },
          {
            key: "marker4",
            position: [48.862, 2.33],
            info:"Parc Highground",
            serviceType: "parcs"
          },
        ]
      };


    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">Bonjour {authenticationService.currentUserValue.username}&nbsp;!</h1>
        </div>
        <h2 className="text-center"> Vous pouvez retrouver ici tous les services dont vous avez besoin pour
        vous occuper au mieux de vos animaux!</h2>
      </div>
      <ServicesMap {...data}/>

      </div>
    );
  }
}




export { ServicesPage };
