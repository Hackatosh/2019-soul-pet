import React from 'react';
import { ServicesMap } from '../components';
import './ServicesPage.css';

class ServicesPage extends React.Component<{}> {
  render(){
    const data = {
        lat: 48.864716,
        lon: 2.349014,
        zoom : 14,
        size : "500px"
      };


    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">De quel service avez-vous besoin ?</h1>
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
