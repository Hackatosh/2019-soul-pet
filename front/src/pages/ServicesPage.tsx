import React from 'react';
<<<<<<< HEAD
=======
import { RouteComponentProps } from 'react-router-dom';
>>>>>>> master
import { ServicesMap } from '../components';
import './ServicesPage.css';
import {AuthenticationService} from "../services";


class ServicesPage extends React.Component<{}> {


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
            serviceType: "vet"
          },
          {
            key: "marker2",
            position: [48.865, 2.338],
            info:"Parc Grasswalker",
            serviceType: "park"
          },
          {
            key: "marker3",
            position: [48.86, 2.36],
            info:"Chewbacca's style, 3 rue des Quatre Fils",
            serviceType: "groom"
          },
          {
            key: "marker4",
            position: [48.862, 2.33],
            info:"Parc Highground",
            serviceType: "park"
          },
        ]
      };


    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
<<<<<<< HEAD
						<h1 className="text-center display-4">De quel service avez-vous besoin ?</h1>
=======
						<h1 className="text-center display-4">Bonjour {AuthenticationService.user.username}&nbsp;!</h1>
>>>>>>> master
        </div>
        <h2 className="text-center"> Vous pouvez retrouver ici tous les services dont vous avez besoin pour
        vous occuper au mieux de vos animaux</h2>
      </div>
      <ServicesMap {...data}/>

      </div>
    );
  }
}




export { ServicesPage };
